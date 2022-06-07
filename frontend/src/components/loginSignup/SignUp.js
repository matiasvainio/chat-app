const SIGN_UP = 'sign-up'

const SignUp = (props) => {
  const { credentials, handleChange, handleSubmit } = props.props
  return (
    <div>
      <h1>sign up</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="email"
          name="email"
          onChange={handleChange}
          value={credentials.email}
        ></input>
        <input
          placeholder="username"
          name="username"
          onChange={handleChange}
          value={credentials.username}
        ></input>
        <input
          placeholder="password"
          name="password"
          onChange={handleChange}
          value={credentials.password}
          type="password"
        ></input>
        <button>submit</button>
      </form>
      <button onClick={() => console.log(credentials)}>button</button>
    </div>
  )
}

export default SignUp
