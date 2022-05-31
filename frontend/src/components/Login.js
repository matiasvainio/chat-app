import React, { useState } from 'react'
import axios from 'axios'
import { setUser } from '../utils/utils'
import { logIn } from '../services/userService'

const Login = () => {
  const emptyCredentials = {
    email: '',
    username: '',
    password: '',
  }
  const [credentials, setCredentials] = useState(emptyCredentials)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = logIn(credentials)
      setUser(response)
    } catch (err) {
      console.log(err)
    }

    setCredentials(emptyCredentials)
  }

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setCredentials((values) => ({ ...values, [name]: value }))
  }

  const renderLoginForm = () => {
    return (
      <div>
        <h1>login</h1>
        <button>signup</button>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={credentials.email}
          ></input>
          <input
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={credentials.username}
          ></input>
          <input
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={credentials.password}
          ></input>
          <button>submit</button>
        </form>
      </div>
    )
  }

  return <div>{renderLoginForm()}</div>
}

export default Login
