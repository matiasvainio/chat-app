import React from 'react'

export const Message = ({ props }) => {
  const { content, _id, date, user } = props
  const currentUser = JSON.parse(window.localStorage.getItem('user'))

  return (
    <li
      className={
        'message ' +
        (currentUser && currentUser.username === user
          ? 'message-sent'
          : 'message-received')
      }
    >
      <p
        className={
          currentUser && currentUser.username === user
            ? 'user-sent'
            : 'user-received'
        }
      >
        {currentUser && currentUser.username === user ? 'You' : user}
      </p>
      <div className="message-content">
        <p>{content}</p>
      </div>
    </li>
  )
}

export default Message
