import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Chat from './Chat'
import SocketContext from './SocketContext'

const Room = () => {
  const socket = useContext(SocketContext)

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

export default Room
