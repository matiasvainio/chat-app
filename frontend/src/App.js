import { io } from 'socket.io-client'
import { ObjectId } from 'bson'
import { useEffect, useState } from 'react'
import { Routes, Route, Link, Outlet, useParams } from 'react-router-dom'
import axios from 'axios'
import './App.css'

const socket = io.connect('localhost:3002')

function App() {
  return (
    <div className="App">
      <nav className="nav">
        <Link to="/">landing</Link>
        <Link to="login">login</Link>
        <Link to="rooms">rooms</Link>
        <Link to="settings">settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="rooms" element={<RoomContainer />}>
          <Route path=":id" element={<Room />} />
        </Route>
        <Route path="settings" element={<Settings />} />
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
    socket.on('chat messages', (incomingMessages) => {
      console.log('chat messages useeffect', socket._callbacks)
      setMessages(incomingMessages)
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
    <div className="chat">
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
        <button>send</button>
      </form>
    </div>
  )
}

const Message = ({ props }) => {
  const { content, _id, date, user } = props
  return (
    <li className="message">
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

  const currentUser = window.localStorage.username

  return (
    <div>
      <h1>username:</h1>
      <form onSubmit={handleSubmit}>
        <input onChange={handleInput} value={username} />
        <button>submit</button>
      </form>
      <h1>current username: {currentUser === undefined ? '' : currentUser}</h1>
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

const RoomContainer = () => {
  return (
    <div className="room-container">
      <Rooms />
      <Outlet />
    </div>
  )
}

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [newRoomName, setNewRoomName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const url = 'http://localhost:3002/api/rooms'

  const getRooms = async () => {
    const response = await axios.get(url)
    setRooms(response.data)
  }

  const handleInput = (event) => {
    event.preventDefault()
    setNewRoomName(event.target.value)
  }

  const createRoom = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post(url, { name: newRoomName })
      setRooms([...rooms, response.data])
      setNewRoomName('')
    } catch (err) {
      console.log('ei onnistu')
    }
  }

  useEffect(() => {
    getRooms()
  }, [])

  return (
    <div className="rooms">
      <h1>rooms</h1>
      <ul style={{ margin: 0, padding: 0 }}>
        {rooms.map((room) => (
          <li style={{ listStyle: 'none' }} key={room._id}>
            <Link to={room.name}>{room.name}</Link>
          </li>
        ))}
      </ul>
      <button onClick={() => setShowForm(!showForm)}>create new room</button>
      {showForm ? (
        <NewRoomForm createRoom={createRoom} handleInput={handleInput} />
      ) : (
        ''
      )}
    </div>
  )
}

const NewRoomForm = ({ createRoom, handleInput, newRoomName }) => {
  return (
    <form className="new-room-form" onSubmit={createRoom}>
      <p>create new room</p>
      <input
        placeholder="room name..."
        onChange={handleInput}
        value={newRoomName}
      ></input>
      <button>submit</button>
    </form>
  )
}

const Room = () => {
  const roomname = useParams()
  console.log(`join room ${roomname.id}`)
  socket.emit('join room', roomname.id)
  return (
    <div className="room">
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
