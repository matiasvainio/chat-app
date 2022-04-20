const express = require('express')
const roomRouter = express.Router()
const verifytoken = require('../middleware/auth')
const Room = require('../models/room')

roomRouter.get('/', async (req, res) => {
  console.log('get rooms')
  const rooms = await Room.find({})
  return res.status(200).json(rooms)
})

roomRouter.post('/', async (req, res) => {
  const { name } = req.body

  const newRoom = new Room({
    name: name,
  })

  try {
    await newRoom.save()
  } catch (err) {
    return res.status(400).json({ error: 'room exists' })
  }

  res.status(200).json(newRoom)
})

module.exports = roomRouter
