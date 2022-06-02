import React, { useState } from 'react'

export const MessageContext = React.createContext()

const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([])

  const appendToMessages = (message) => setMessages([...messages, message])

  return (
    <MessageContext.Provider value={{ messages, appendToMessages }}>
      {children}
    </MessageContext.Provider>
  )
}

const withMessages = (Child) => (props) =>
  (
    <MessageContext.Consumer>
      {(context) => <Child {...props} {...context} />}
    </MessageContext.Consumer>
  )

export { MessageProvider, withMessages }
