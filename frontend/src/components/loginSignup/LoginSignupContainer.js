import { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'

const LoginSignupContainer = () => {
  const [toggle, setToggle] = useState(false)

  return (
    <div>
      <button onClick={() => setToggle(!toggle)}>
        {toggle ? 'sign up' : 'login'}
      </button>
      {toggle ? <Login /> : <SignUp />}
    </div>
  )
}

export default LoginSignupContainer
