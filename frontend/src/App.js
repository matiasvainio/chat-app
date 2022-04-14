import './App.css'
import { io } from 'socket.io-client'
import { ObjectId } from 'bson'
import { useEffect, useState } from 'react'
import { Routes, Route, Link, Outlet, useParams } from 'react-router-dom'

const socket = io.connect('localhost:3002')

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="login">login</Link>
        <Link to="rooms">rooms</Link>
        <Link to="settings">settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />}>
          <Route path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="rooms" element={<Rooms />}>
            <Route path=":id" element={<Room />} />
          </Route>
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

const Chat = ({ roomid }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    socket.off('chat messages')
    socket.off('chat message')
  })

  useEffect(() => {
    socket.on('chat messages', (messages) => {
      console.log('chat messages useeffect', socket._callbacks)
      setMessages(messages)
    })
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
      date: new Date(),
      roomid: roomid,
      user: window.localStorage.getItem('username'),
    }

    socket.emit('chat message', message)
    setInput('')
  }

  const handleInput = (event) => {
    event.preventDefault()
    setInput(event.target.value)
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', border: 0, padding: 0 }}>
        {messages.map((message) => (
          <Message key={message._id} props={message} />
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Type..."
          onChange={handleInput}
          value={input}
        ></input>
        <button>submit</button>
      </form>
    </div>
  )
}

const Message = ({ props }) => {
  const { content, _id, date, user } = props
  return (
    <li>
      <p>{content}</p>
      <p>{user}</p>
    </li>
  )
}

const Login = () => {
  return (
    <div>
      <h1>login</h1>
      <form>
        <input placeholder="Username"></input>
        <input placeholder="Password"></input>
        <button>submit</button>
      </form>
    </div>
  )
}

const Landing = () => {
  const [username, setUsername] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    window.localStorage.setItem('username', username)
    setUsername('')
  }

  const handleInput = (event) => {
    event.preventDefault()
    setUsername(event.target.value)
  }

  return (
    <div>
      <h1>username:</h1>
      <form onSubmit={handleSubmit}>
        <input onChange={handleInput} value={username} />
        <button>submit</button>
      </form>
      <Outlet />
    </div>
  )
}

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

const Rooms = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'general' },
    { id: 2, name: 'politics' },
  ])

  return (
    <div>
      <h1>rooms</h1>
      <ul style={{ margin: 0, padding: 0 }}>
        {rooms.map((room) => (
          <li style={{ listStyle: 'none' }} key={room.id}>
            <Link to={room.name}>{room.name}</Link>
          </li>
        ))}
        <Outlet />
      </ul>
    </div>
  )
}

const Room = () => {
  const roomname = useParams()
  console.log(`join room ${roomname.id}`)
  socket.emit('join room', roomname.id)
  // socket.off('chat messages')
  // socket.off('chat message')
  return (
    <div>
      <h1>{roomname.id}</h1>
      <Chat roomid={roomname.id} />
    </div>
  )
}

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
    </div>
  )
}

export default App
