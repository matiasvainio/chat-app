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
      </nav>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="login" element={<Login />} />
          <Route path="rooms" element={<Rooms />}>
            <Route path=":id" element={<Room />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

const Chat = ({ roomid }) => {
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
      date: new Date(),
      roomid: roomid,
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
        <button>Submit</button>
      </form>
    </div>
  )
}

const Message = ({ props }) => {
  const { content, _id, date } = props
  return <li>{content}</li>
}

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input placeholder="Username"></input>
        <input placeholder="Password"></input>
        <button>Submit</button>
      </form>
    </div>
  )
}

const Home = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}

const Rooms = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'General' },
    { id: 2, name: 'Politics' },
  ])

  return (
    <div>
      <h1>Rooms</h1>
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
  return (
    <div>
      <h1>{roomname.id}</h1>
      <Chat roomid={roomname.id} />
    </div>
  )
}

export default App
