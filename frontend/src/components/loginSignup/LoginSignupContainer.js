import { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import { logIn, register } from '../../adapters/userService'
import { setUser } from '../../utils/utils'

const LoginSignupContainer = () => {
  const [toggle, setToggle] = useState(false)
  const emptyCredentials = {
    email: '',
    username: '',
    password: '',
  }
  const [credentials, setCredentials] = useState(emptyCredentials)

  const handleSubmitSignup = async (event) => {
    event.preventDefault()

    // try {
    //   const response = await logIn(credentials)
    //   setUser(response)
    // } catch (err) {
    //   console.log(err)
    // }

    console.log('sign-up');

    setCredentials(emptyCredentials)
  }

  const handleSubmitLogin = async (event) => {
    event.preventDefault()

    // try {
    //   const response = await logIn(credentials)
    //   setUser(response)
    // } catch (err) {
    //   console.log(err)
    // }

    console.log('login');

    setCredentials(emptyCredentials)
  }

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setCredentials((values) => ({ ...values, [name]: value }))
  }

  const props = { credentials, handleChange }

  return (
    <div>
      <button onClick={() => setToggle(!toggle)}>
        {toggle ? 'sign up' : 'login'}
      </button>
      {toggle ? (
        <Login props={{ ...props, handleSubmit: handleSubmitLogin }} />
      ) : (
        <SignUp props={{...props, handleSubmit: handleSubmitSignup}} />
      )}
    </div>
  )
}

export default LoginSignupContainer
