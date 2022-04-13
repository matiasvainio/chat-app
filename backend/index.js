const express = require('express')
const mongoose = require('mongoose')
const messageRouter = express.Router()
require('dotenv').config()

const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)

const messageSchema = new mongoose.Schema({
  content: String,
  date: Date,
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
    date: new Date(),
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
  res.send('hello world')
})

app.listen(3001, () => {
  console.log('server running')
})
