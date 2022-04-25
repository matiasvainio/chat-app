import { io } from 'socket.io-client'
import { ObjectId } from 'bson'
import { useEffect, useState, useRef } from 'react'
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
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    socket.off('chat messages')
    socket.off('chat message')
  })

  useEffect(() => {
    socket.on('chat messages', (incomingMessages) => {
      setMessages(incomingMessages)
    })
  })

  useEffect(() => {
    socket.on('chat message', (message) => {
      setMessages([...messages, message])
    })
  })

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 0)
  }, [messages])

  const handleSubmit = (event) => {
    event.preventDefault()

    const message = {
      _id: new ObjectId().toString(),
      content: input,
      date: new Date(),
      roomid: roomid,
      user: JSON.parse(window.localStorage.getItem('user')).username,
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
      <div className="chat-messages">
        <ul style={{ listStyle: 'none', border: 0, padding: 0 }}>
          {messages.map((message) => (
            <Message key={message._id} props={message} />
          ))}
        </ul>
        <div ref={messagesEndRef} />
      </div>

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
  const currentUser = JSON.parse(window.localStorage.getItem('user'))

  return (
    <li
      className={
        'message ' +
        (currentUser.username === user ? 'message-sent' : 'message-received')
      }
    >
      <p
        className={
          currentUser.username === user ? 'user-sent' : 'user-received'
        }
      >
        {currentUser.username === user ? 'You' : user}
      </p>
      <div className="message-content">
        <p>{content}</p>
      </div>
    </li>
  )
}

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
    console.log(credentials)
  }

  return (
    <div>
      <h1>login</h1>
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
  const emtpyRoomObj = { name: '', private: false }
  const [rooms, setRooms] = useState([])
  const [newRoom, setNewRoom] = useState(emtpyRoomObj)
  const [showForm, setShowForm] = useState(false)

  const url = 'http://localhost:3002/api/rooms'

  const getRooms = async () => {
    const response = await axios.get(url)
    setRooms(response.data)
  }

  const handleInput = (event) => {
    const name = event.target.name
    const value = event.target.value
    setNewRoom((values) => ({
      ...values,
      [name]: name === 'private' ? !newRoom.private : value,
    }))
  }

  const createRoom = async (event) => {
    event.preventDefault()
    const user = JSON.parse(window.localStorage.getItem('user'))

    try {
      if (!user) return

      const response = await axios.post(url, {
        ...newRoom,
        createdBy: user._id,
      })
      setRooms([...rooms, response.data])
    } catch (err) {
      console.log('ei onnistu')
    }
    setNewRoom(emtpyRoomObj)
  }

  useEffect(() => {
    getRooms()
  }, [])

  const renderRooms = () => {
    const user = JSON.parse(window.localStorage.getItem('user'))

    return (
      <ul style={{ margin: 0, padding: 0 }}>
        {rooms.map((room) => {
          console.log(room)
          return (
            <li style={{ listStyle: 'none' }} key={room._id}>
              <Link to={room.name}>{room.name}</Link>
              {user && room.createdBy === user._id ? <button>delete</button> : ''}
            </li>
          )
        })}
      </ul>
    )
  }

  const renderLoading = () => {
    return <div className="loader"></div>
  }

  const renderNewRoomForm = () => {
    const user = JSON.parse(window.localStorage.getItem('user'))

    if (user && user.token) {
      return (
        <div>
          <button onClick={() => setShowForm(!showForm)}>
            create new room
          </button>
          <NewRoomForm
            createRoom={createRoom}
            handleInput={handleInput}
            newRoom={newRoom}
            showForm={showForm}
          />
        </div>
      )
    }
    return ''
  }

  return (
    <div className="rooms">
      <h1>Chat Rooms</h1>
      {rooms.length !== 0 ? renderRooms() : renderLoading()}
      {renderNewRoomForm()}
    </div>
  )
}

const NewRoomForm = ({ createRoom, handleInput, newRoom, showForm }) => {
  return (
    <form
      className="new-room-form"
      style={{ display: showForm ? 'block' : 'none' }}
      onSubmit={createRoom}
    >
      <p>create new room</p>
      <input
        placeholder="room name..."
        onChange={handleInput}
        value={newRoom.name}
        name="name"
      ></input>
      <input
        type="checkbox"
        onChange={handleInput}
        name="private"
        checked={newRoom.private}
      ></input>
      <button>submit</button>
    </form>
  )
}

const Room = () => {
  const [room, setRoom] = useState(true)
  const roomname = useParams()
  socket.emit('join room', roomname.id)

  useEffect(() => {
    socket.off('error')
    socket.off('success')
  })

  useEffect(() => {
    socket.on('error', (err) => {
      setRoom(false)
    })
  })

  useEffect(() => {
    socket.on('success', () => {
      setRoom(true)
    })
  })

  if (room) {
    return (
      <div className="room">
        <h1>{roomname.id}</h1>
        <Chat roomid={roomname.id} />
      </div>
    )
  }
  return (
    <div>
      <h1>Not found</h1>
    </div>
  )
}

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

export default App
