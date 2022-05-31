import axios from 'axios'

const LOGIN_URL = 'http://localhost:3002/api/user/login'
const REGISTER_URL = 'http://localhost:3002/api/user/register'

export const logIn = async (credentials) => {
  const response = await axios.post(LOGIN_URL, credentials)
  return response.data
}

export const register = async (credentials) => {
  const response = await axios.post(REGISTER_URL, credentials)
  return response.data
}
