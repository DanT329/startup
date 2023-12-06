// MessageForm.jsx
import React, { useState } from 'react';

const MessageForm = ({ socket }) => {
  const [message, setMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.trim() && socket) {
      const msgData = {
        name: 'SenderName', // Replace with the actual sender's name
        text: message.trim(),
      };

      socket.emit('message', msgData);
      setMessage('');
    }
  };

  return (
    <form className="form-msg" onSubmit={sendMessage}>
      <input
        type="text"
        id="message"
        placeholder="Your Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageForm;
