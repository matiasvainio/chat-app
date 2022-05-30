const Message = require('../models/message')
const express = require('express')
const messageRouter = express.Router()

messageRouter.get('/', async (_req, res) => {
  const messages = await Message.find({})
  res.status(200).json(messages)
})

messageRouter.post('/', async (req, res) => {
  const body = req.body
  if (!body.content && !body.user) {
    return res.status(400).json({ error: 'invalid message' })
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

messageRouter.post('/clear', async (_req, res) => {
  await Message.deleteMany({})
  res.status(200).json({ content: 'messages removed' })
})

module.exports = messageRouter
