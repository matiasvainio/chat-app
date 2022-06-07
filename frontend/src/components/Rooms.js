import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import NewRoomForm from './NewRoomForm'
import { getRooms, createRoom } from '../adapters/roomService'

const Rooms = () => {
  const emtpyRoomObj = { name: '', private: false }
  const [rooms, setRooms] = useState([])
  const [newRoom, setNewRoom] = useState(emtpyRoomObj)
  const [showForm, setShowForm] = useState(false)
  const [options, setOptions] = useState([])

  const url = 'http://localhost:3002/api/rooms'

  const getRoomsAsync = async () => {
    const response = await getRooms()
    setRooms(response)
  }

  const handleInput = (event) => {
    const name = event.target.name
    const value = event.target.value
    setNewRoom((values) => ({
      ...values,
      [name]: name === 'private' ? !newRoom.private : value,
    }))
  }

  const handleCreateRoom = async (event) => {
    event.preventDefault()
    const response = handleCreateRoom(newRoom)
    setRooms([...rooms, response])
    setNewRoom(emtpyRoomObj)
  }

  useEffect(() => {
    getRoomsAsync()
  }, [])

  const isVisible = (id) => options[id] === true

  const handleModify = (id) => {
    setOptions({ ...options, [id]: !isVisible(id) })
  }

  const deleteRoom = () => {}

  const renameRoom = () => {}

  const toggleRoomVisibility = async (room) => {
    console.log(room)
    const newRoom = {
      ...room,
      private: !room.private,
    }
    const response = await axios.put(`${url}/${room._id}`, newRoom)
    console.log(response)
  }

  const messageOptionsWindow = (room) => {
    return (
      <div>
        <button>delete</button>
        <button>rename</button>
        <label>is private?</label>
        <input
          type="checkbox"
          onClick={() => toggleRoomVisibility(room)}
          defaultChecked={room.private}
        ></input>
      </div>
    )
  }

  const renderRooms = () => {
    const user = JSON.parse(window.localStorage.getItem('user'))

    return (
      <ul style={{ margin: 0, padding: 0 }}>
        {rooms.map((room) => {
          if ((user && room.createdBy === user._id) || room.private === false) {
            return (
              <li style={{ listStyle: 'none' }} key={room._id}>
                <Link to={room.name}>
                  {room.name} {}
                </Link>
                {user && room.createdBy === user._id ? (
                  <button onClick={() => handleModify(room._id)}>
                    options
                  </button>
                ) : (
                  ''
                )}
                {options[room._id] === true ? messageOptionsWindow(room) : ''}
              </li>
            )
          }
          return ''
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
            handleCreateRoom={handleCreateRoom}
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

export default Rooms
