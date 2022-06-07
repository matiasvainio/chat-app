
const Login = (props) => {
  const { credentials, handleChange, handleSubmit } = props.props
  return (
    <div>
      <h1>login</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={credentials.email}
        ></input>
        {/* <input
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={credentials.username}
          ></input> */}
        <input
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={credentials.password}
        ></input>
        <button>submit</button>
      </form>
    </div>
  )
}

export default Login
