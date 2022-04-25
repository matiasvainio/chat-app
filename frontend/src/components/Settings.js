import React, { useState } from 'react'

const Settings = () => {
  const [user, setUser] = useState(window.localStorage.getItem('user'))

  const logOut = () => {
    window.localStorage.removeItem('user')
    setUser('')
  }

  return (
    <div>
      <h1>Settings</h1>
      {user ? <button onClick={logOut}>logout</button> : ''}
      <button
        onClick={() =>
          console.log(JSON.parse(window.localStorage.getItem('user')))
        }
      >
        foo
      </button>
    </div>
  )
}

export default Settings
