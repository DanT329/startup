// ChatDisplay.jsx
import React, { useState, useEffect } from 'react';

const ChatDisplay = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('message');
    };
  }, [socket]);

  return (
    <ul className="chat-display">
      {messages.map(({ name, text, time }, index) => (
        <li key={index}>
          {/* Render message details */}
          <div>{`${name}: ${text}`}</div>
          <div>{`Time: ${time}`}</div>
        </li>
      ))}
    </ul>
  );
};

export default ChatDisplay;
