import './App.css';
import { io } from 'socket.io-client';
import { ObjectId } from 'bson';
import { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

const socket = io.connect('localhost:3002');

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/login">login</Link>
        <Link to="/rooms">rooms</Link>
        <Link to="/chat">chat</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/rooms" element={<h1>rooms</h1>}></Route>
        <Route path="/chat" element={<Chat />}></Route>
      </Routes>
    </div>
  );
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (messages.length === 0) {
      socket.on('chat messages', (messages) => {
        console.log('chat messages useeffect');
        setMessages(messages);
      });
    }
  }, [messages]);

  useEffect(() => {
    socket.on('chat message', (message) => {
      setMessages([...messages, message]);
    });
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = {
      _id: new ObjectId().toString(),
      content: input,
      date: new Date(),
    };

    socket.emit('chat message', message);
    setInput('');
    console.log(messages);
  };

  const handleInput = (event) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.map((message) => (
          <Message key={message._id} props={message} />
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Type..."
          onChange={handleInput}
          value={input}
        ></input>
        <button>Submit</button>
      </form>
    </div>
  );
};

const Message = ({ props }) => {
  const { content, _id, date } = props;
  return <li>{content}</li>;
};

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input placeholder='Username'></input>
        <input placeholder='Password'></input>
        <button>Submit</button>
      </form>
    </div>
  );
};



export default App;
