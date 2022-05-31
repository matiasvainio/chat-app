const express = require('express')
const roomRouter = express.Router()
const verifytoken = require('../middleware/auth')
const Room = require('../models/room')

roomRouter.get('/', async (req, res) => {
  const rooms = await Room.find({})
  return res.status(200).json(rooms)
})

roomRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const room = await Room.find({ $or: [{ private: false }, { createdBy: id }] })
  if (room) return res.status(200).json(room)
  return res.status(404)
})

roomRouter.get('/:id', (req, res) => {
  console.log('foo')
  // console.log(req.query)
})

roomRouter.post('/', async (req, res) => {
  const { name, createdBy, privacy } = req.body

  if (!(name && createdBy && privacy !== undefined)) 
    return res.status(400).json({ error: 'invalid content' })

  const newRoom = new Room({
    name,
    createdBy,
    privacy,
  })

  try {
    await newRoom.save()
  } catch (err) {
    return res.status(400).json({ error: 'room exists' })
  }

  res.status(200).json(newRoom)
})

roomRouter.put('/:id', async (req, res) => {
  const room = req.body

  const response = await Room.updateOne(
    { _id: room._id },
    { $set: { private: room.private } }
  )
})

module.exports = roomRouter
