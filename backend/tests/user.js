const assert = require('assert')
const mongoose = require('mongoose')
const User = require('../models/user')

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const should = chai.should()

chai.use(chaiHttp)

describe('User', () => {
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done()
    })
  })

  const user = {
    username: 'batman',
    email: 'email@email.com',
    password: 'foobar',
  }

  describe('/POST register user', () => {
    it('it should POST user with correct credentials', (done) => {
      chai
        .request(server)
        .post('/api/user/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
        })
      done()
    })
  })

  describe('/POST register user which exists', () => {
    before(() => {
      chai
        .request(server)
        .post('/api/user/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201)
        })
    })
    it('it should not work', (done) => {
      chai
        .request(server)
        .post('/api/user/register')
        .send(user)
        .end((err, res) => {
          res.should.have.status(400)
        })
      done()
    })
  })

  describe('/POST register user with invalid credentials', () => {
    it('it should send http error code', (done) => {
      chai
        .request(server)
        .post('/api/user/register')
        .send({ email: 'email@email.com' })
        .end((err, res) => {
          res.should.have.status(400)
        })
      chai
        .request(server)
        .post('/api/user/register')
        .send({ email: 'email@email.com', password: 'foobar' })
        .end((err, res) => {
          res.should.have.status(400)
        })
      chai
        .request(server)
        .post('/api/user/register')
        .send({ username: 'batman', password: 'foobar' })
        .end((err, res) => {
          res.should.have.status(400)
        })
      chai
        .request(server)
        .post('/api/user/register')
        .send({ password: 'foobar' })
        .end((err, res) => {
          res.should.have.status(400)
        })
      done()
    })
  })

  describe('/POST login', () => {
    it('it should send 200 when credentials are correct and user exists', (done) => {
      chai
        .request(server)
        .post('/api/user/login')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          res.should.have.status(200)
        })
      done()
    })

    it('it should send 400 if credentials are missing', (done) => {
      chai
        .request(server)
        .post('/api/user/login')
        .send({})
        .end((err, res) => {
          res.should.have.status(400)
        })
      done()
    })

    it('it should send 400 if credentials are wrong', (done) => {
      chai
        .request(server)
        .post('/api/user/login')
        .send({ email: 'email@email.com', password: 'bizbaz' })
        .end((err, res) => {
          res.should.have.status(400)
        })
      done()
    })
  })
})
