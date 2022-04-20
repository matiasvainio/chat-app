const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const messageRouter = require('./routes/messageRouter')
const userRouter = require('./routes/userRouter')
const verifytoken = require('./middleware/auth')
const Message = require('./models/message')

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

app.use('/api/messages', verifytoken, messageRouter)
app.use('/api/user', userRouter)

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
    socket.rooms.forEach((room) => {
      socket.leave(room)
    })
    socket.join(roomid)
    socket.to(roomid).emit('chat messages', await getMessages(roomid))
  })
})

httpServer.listen(3002)
