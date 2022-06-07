import axios from 'axios'
import { getUser } from '../utils/utils'

const URL = 'http://localhost:3002/api/rooms'

export const getRooms = async () => {
  const user = getUser()
  console.log(user)
  if (user && user._id) {
    const response = await axios.get(`${URL}/${user._id}`)
    return response.data
  }
}

export const createRoom = async (room) => {
  const user = getUser()
  try {
    if (!user) return

    const response = await axios.post(URL, { ...room, createdBy: user._id })
    return response.data
  } catch (err) {
    console.log(err)
  }
}
