const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../index')
const Room = require('../models/room')
const User = require('../models/user')

beforeEach(async () => {
  await Room.deleteMany({})
})

describe('retrieve rooms', () => {
  test('GET /api/rooms', async () => {
    const newRoom = new Room({
      name: 'new-room',
      createdBy: new User({ username: 'batman' }),
      private: false,
    })

    try {
      await newRoom.save()
    } catch (err) {
      console.log(err)
    }
    const response = await request(app).get('/api/rooms').expect(200)
    expect(response.body[0].name).toBe('new-room')
  })
})

describe('posting a new room object', () => {
  test('POST /api/rooms with correct room object, succeeds', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({
        name: 'new-room',
        createdBy: new User({ username: 'batman' }),
        privacy: false,
      })
      .expect(200)

    expect(response.body.name).toBe('new-room')
  })

  test('POST /api/rooms with empty room object, fails', async () => {
    const response = await request(app).post('/api/rooms').send({}).expect(400)
  })

  test('POST /api/rooms with false privacy', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({ privacy: false })
      .expect(400)
  })

  test('POST /api/rooms with false privacy and name, fails', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({ name: 'new-room', privacy: false })
      .expect(400)
  })

  test('POST /api/rooms with false privacy and name, fails', async () => {
    const response = await request(app)
      .post('/api/rooms')
      .send({ name: 'new-room', user: new User({ name: 'batman' }) })
      .expect(400)
  })

  test('POST /api/rooms with duplicate room, fails', async () => {
    const newRoom = {
      name: 'new-room',
      createdBy: new User({ username: 'batman' }),
      privacy: false,
    }

    await request(app).post('/api/rooms').send(newRoom).expect(200)

    const response = await request(app)
      .post('/api/rooms')
      .send(newRoom)
      .expect(400)

    expect(response.body.error).toContain('room exists')
  })
})
