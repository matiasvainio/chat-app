import React from 'react'

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

export default NewRoomForm
