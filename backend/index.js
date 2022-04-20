const express = require('express')
const mongoose = require('mongoose')
const messageRouter = express.Router()
const userRouter = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

const userSchema = new mongoose.Schema({
  username: { type: String, default: null },
  email: { type: String, unique: true },
  password: String,
  token: String,
})

const Message = mongoose.model('Message', messageSchema)
const User = mongoose.model('User', userSchema)

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

userRouter.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body
    if (!(username && password && email)) {
      res.status(400).json({ error: 'all input required' })
    }

    const oldUser = await User.findOne({ email })

    if (oldUser) {
      return res.status(400).json({ error: 'user already exists' })
    }

    encryptedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      password: encryptedPassword,
      email: email.toLowerCase(),
    })

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '2h',
      }
    )

    user.token = token

    res.status(201).json(user)
  } catch (err) {
    console.log(err)
  }
})

userRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      res.status(400).json({ error: 'username or password missing' })
    }

    const user = await User.findOne({ email })

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return res.status(400).json({ error: 'invalid credentials' })
    }

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '2h',
      }
    )
    user.token = token

    res.status(200).json(user)
  } catch (err) {
    console.log(err)
  }
})

const verifytoken = (req, res, next) => {
  const auth = req.headers.authorization
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7)
  }

  console.log(req.token);

  if (!req.token) {
    return res.status(403).json({ error: 'token required for authentication' })
  }

  try {
    const decoded = jwt.verify(req.token, process.env.JWT_SECRET_KEY)
    req.user = decoded
  } catch (err) {
    console.log(err)
  }

  return next()
}

app.use('/api/messages', verifytoken, messageRouter)
app.use('/api/user', userRouter)
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
    user: message.user,
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
