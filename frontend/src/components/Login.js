import React, { useState } from 'react'
import axios from 'axios'

const Login = () => {
  const emptyCredentials = {
    email: '',
    username: '',
    password: '',
  }
  const [credentials, setCredentials] = useState(emptyCredentials)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const url = 'http://localhost:3002/api/user/login'

    try {
      const response = await axios.post(url, credentials)
      console.log(response.data)
      window.localStorage.setItem('user', JSON.stringify(response.data))
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
