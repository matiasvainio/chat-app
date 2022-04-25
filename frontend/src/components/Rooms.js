import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import NewRoomForm from './NewRoomForm'

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
              {user && room.createdBy === user._id ? (
                <button>delete</button>
              ) : (
                ''
              )}
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
      {/* {rooms.length !== 0 ? renderRooms() : renderLoading()} */}
      {renderRooms()}
      {/* {renderNewRoomForm()} */}
    </div>
  )
}

export default Rooms
