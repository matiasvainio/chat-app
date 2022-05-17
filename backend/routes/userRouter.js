const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const express = require('express')
const userRouter = express.Router()

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

    const encryptedPassword = await bcrypt.hash(password, 10)

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
      console.log(email, password)
      return res.status(400).json({ error: 'username or password missing' })
    }

    const user = await User.findOne({ email })

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      console.log('invalid creds')
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

module.exports = userRouter
