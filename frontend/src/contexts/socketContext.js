import { createContext } from 'react'
import { io } from 'socket.io-client'

export const socket = io.connect('localhost:3002')

const SocketContext = createContext({
  socket: socket,
})

export default SocketContext
