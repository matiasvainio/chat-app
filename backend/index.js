const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const messageRouter = require('./routes/messageRouter')
const userRouter = require('./routes/userRouter')
const roomRouter = require('./routes/roomRouter')
const verifytoken = require('./middleware/auth')
const Message = require('./models/message')

const { Server } = require('socket.io')
const { createServer } = require('http')
const Room = require('./models/room')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.use(cors())
app.use(express.json())

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)

app.use('/api/messages', verifytoken, messageRouter)
app.use('/api/user', userRouter)
app.use('/api/rooms', roomRouter)

const saveMessage = async (message) => {
  const newMessage = new Message({
    content: message.content,
    user: message.user,
    date: new Date(),
    roomid: message.roomid,
  })

  await newMessage.save()
}

const getMessages = async (roomid) => {
  return Message.find({ roomid: roomid })
}

io.on('connection', async (socket) => {
  socket.on('chat message', (message) => {
    socket.to(message.roomid).emit('chat message', message)
    saveMessage(message)
  })

  socket.on('join room', async (roomid) => {
    const room = await Room.findOne({ name: roomid })

    if (!room) socket.emit('error', { errror: 'not found' })
    else socket.emit('success')

    socket.rooms.forEach((room) => {
      socket.leave(room)
    })
    socket.join(roomid)
    socket.to(roomid).emit('chat messages', await getMessages(roomid))
  })
})

httpServer.listen(3002)

module.exports = app
