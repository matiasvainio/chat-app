const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../index')
const User = require('../models/user')

const LOGIN_URL = '/api/user/login'
const REGISTER_URL = '/api/user/register'

beforeEach(async () => {
  await User.deleteMany({})
})

describe('user register tests', () => {
  const newUser = {
    username: 'batman',
    email: 'email@email.com',
    password: 'foobar',
  }

  test('POST register a new user with valid credentials', async () => {
    const response = await request(app)
      .post(REGISTER_URL)
      .send(newUser)
      .expect(201)

    expect(response.body.username).toBe(newUser.username)
  })

  test('try to register existing user', async () => {
    await request(app).post(REGISTER_URL).send(newUser).expect(201)
    await request(app).post(REGISTER_URL).send(newUser).expect(400)
  })

  describe('POST register a new user with invalid credentials', () => {
    test('missing username returns 400', async () => {
      newUser.username = ''
      await request(app).post(REGISTER_URL).send(newUser).expect(400)
    })

    test('missing password returns 400', async () => {
      newUser.username = 'batman'
      newUser.password = ''
      await request(app).post(REGISTER_URL).send(newUser).expect(400)
    })

    test('missing email returns 400', async () => {
      newUser.username = 'batman'
      newUser.password = 'foobar'
      newUser.email = ''
      await request(app).post(REGISTER_URL).send(newUser).expect(400)
    })

    test('empty user returns 400', async () => {
      await request(app).post(REGISTER_URL).send({}).expect(400)
    })
  })
})

describe('user login tests', () => {
  test('test correct login', async () => {
    await request(app)
      .post(REGISTER_URL)
      .send({
        username: 'batman',
        email: 'email@email.com',
        password: 'foobar',
      })
      .expect(201)

    await request(app)
      .post(LOGIN_URL)
      .send({
        email: 'email@email.com',
        username: 'batman',
        password: 'foobar',
      })
      .expect(200)
  })

  describe('test missing credentials', () => {
    const user = {
      username: 'batman',
      email: 'email@email.com',
      password: 'foobar',
    }

    beforeEach(() => {
      user.username = 'batman'
      user.email = 'email@email.com'
      user.password = 'foobar'
    })

    test('missing email', async () => {
      user.email = ''
      await request(app).post(LOGIN_URL).send(user).expect(400)
    })

    test('missing username', async () => {
      user.username = ''
      await request(app).post(LOGIN_URL).send(user).expect(400)
    })

    test('missing user', async () => {
      await request(app).post(LOGIN_URL).send({}).expect(400)
    })
  })
})
