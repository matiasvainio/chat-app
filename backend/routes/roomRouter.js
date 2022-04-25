const express = require('express')
const roomRouter = express.Router()
const verifytoken = require('../middleware/auth')
const Room = require('../models/room')

roomRouter.get('/', async (req, res) => {
  const rooms = await Room.find({})
  return res.status(200).json(rooms)
})

roomRouter.get('/:id', async (req, res) => {
  console.log(req.params)
  const room = await Room.findOne({name: req.params.id})
  if (room) return res.status(200).json(room)
  return res.status(404)
})

roomRouter.post('/', async (req, res) => {
  const { name, createdBy, private } = req.body

  const newRoom = new Room({
    name,
    createdBy,
    private,
  })

  console.log(newRoom)

  try {
    await newRoom.save()
  } catch (err) {
    return res.status(400).json({ error: 'room exists' })
  }

  res.status(200).json(newRoom)
})

module.exports = roomRouter
