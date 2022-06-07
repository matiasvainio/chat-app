import { useState, useEffect, useRef, useContext } from 'react'
import { ObjectId } from 'bson'
import Message from './Message'
import SocketContext from '../contexts/socketContext'
import { getUser } from '../utils/utils'

const Chat = ({ roomid }) => {
  const socket = useContext(SocketContext)
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

    const user = getUser()

    if (user) {
      const message = {
        _id: new ObjectId().toString(),
        content: input,
        date: new Date(),
        roomid: roomid,
        user: user.username,
      }

      socket.emit('chat message', message)
      setInput('')
      return
    }

    console.log('set username please')
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

export default Chat
