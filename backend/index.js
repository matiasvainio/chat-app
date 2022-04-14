const express = require('express')
const mongoose = require('mongoose')
const messageRouter = express.Router()
require('dotenv').config()

const { Server } = require('socket.io')
const { createServer } = require('http')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)

const messageSchema = new mongoose.Schema({
  content: String,
  user: String,
  date: Date,
  roomid: String,
})

const Message = mongoose.model('Message', messageSchema)

messageRouter.get('/', async (req, res, next) => {
  const messages = await Message.find({})
  res.status(200).json(messages)
})

messageRouter.post('/', async (req, res, next) => {
  const body = req.body
  if (body.content === undefined) {
    return res.status(401).json({ error: 'content missing' })
  }

  const message = new Message({
    content: body.content,
    user: body.user,
    date: new Date(),
    roomid: String,
  })

  await message.save()

  const messages = await Message.find({})

  res.status(200).json(messages)
})

app.use('/api/messages', messageRouter)
// remove all messages with any request
app.use('/api/clear', async (req, res, next) => {
  await Message.deleteMany({})
  res.status(200).json({ content: 'messages removed' })
})

app.use('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

const saveMessage = async (message) => {
  const newMessage = new Message({
    content: message.content,
    // user: message.user,
    date: new Date(),
    roomid: message.roomid,
  })

  await newMessage.save()
}

const getMessages = async (roomid) => {
  return await Message.find({ roomid: roomid })
}

io.on('connection', async (socket) => {
  socket.on('chat message', (message) => {
    socket.emit('chat message', message)
    saveMessage(message)
  })

  socket.on('join room', async (roomid) => {
    socket.emit('chat messages', await getMessages(roomid))
  })
})

httpServer.listen(3002)
