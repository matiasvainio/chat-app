import React, { useState } from 'react'

const Landing = () => {
  const [username, setUsername] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    window.localStorage.setItem('user', JSON.stringify({ username: username }))
    setUsername('')
  }

  const handleInput = (event) => {
    event.preventDefault()
    setUsername(event.target.value)
  }

  const currentUser = JSON.parse(window.localStorage.getItem('user'))

  return (
    <div>
      <h1>username:</h1>
      <form onSubmit={handleSubmit}>
        <input onChange={handleInput} value={username} />
        <button>submit</button>
      </form>
      <h1>
        current username: {currentUser === null ? '' : currentUser.username}
      </h1>
    </div>
  )
}

export default Landing
