import { Routes, Route, Link, Outlet } from 'react-router-dom'
import './App.css'
import Landing from './components/Landing'
import LoginSignupContainer from './components/loginSignup/LoginSignupContainer'
import Room from './components/Room'
import Settings from './components/Settings'
import Rooms from './components/Rooms'

function App() {
  return (
    <div className="App">
      <nav className="nav">
        <Link to="/">landing</Link>
        <Link to="login">login</Link>
        <Link to="rooms">rooms</Link>
        <Link to="settings">settings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="login" element={<LoginSignupContainer />} />
        <Route path="rooms" element={<RoomContainer />}>
          <Route path=":id" element={<Room />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  )
}

const RoomContainer = () => {
  return (
    <div className="room-container">
      <Rooms />
      <Outlet />
    </div>
  )
}

export default App
