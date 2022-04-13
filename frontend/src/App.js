import './App.css'
import { io } from 'socket.io-client'
import { ObjectId } from 'bson'
import { useEffect, useState } from 'react'

const socket = io.connect('localhost:3002')

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (messages.length === 0) {
      socket.on('chat messages', (messages) => {
        console.log('chat messages useeffect')
        setMessages(messages)
      })
    }
  })

  useEffect(() => {
    socket.on('chat message', (message) => {
      setMessages([...messages, message])
    })
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    const message = {
      _id: new ObjectId().toString(),
      content: input,
    }

    socket.emit('chat message', message)
    setInput('')
  }

  const handleInput = (event) => {
    event.preventDefault()
    setInput(event.target.value)
  }

  return (
    <div className="App">
      <h1>Hello world</h1>
      {messages.map((x) => (
        <li key={x._id}>{x.content}</li>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Type..."
          onChange={handleInput}
          value={input}
        ></input>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default App
