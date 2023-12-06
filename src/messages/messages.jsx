import React, { useState, useEffect } from 'react';

export function Messages() {
  const [receiverName, setReceiverName] = useState(localStorage.getItem('receiver'));
  const [senderName, setSenderName] = useState(localStorage.getItem('newUserName'));
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState([]);
  const [conversationChains, setConversationChains] = useState([]);

  const fetchAndDisplayMessages = () => {
    fetch(`/api/conversation?user1=${encodeURIComponent(senderName)}&user2=${encodeURIComponent(receiverName)}`)
      .then(response => response.json())
      .then(data => {
        setMessages(data);
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchConversationChains = () => {
    fetch(`/api/uniqueConversations?user=${encodeURIComponent(senderName)}`)
      .then(response => response.json())
      .then(data => {
        setConversationChains(data);
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchAndDisplayMessages();
    fetchConversationChains();

    const intervalId = setInterval(() => {
      fetchAndDisplayMessages();
      fetchConversationChains();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [senderName, receiverName]);

  const handleLogout = () => {
    localStorage.removeItem('newUserName');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => window.location.href = 'login.html');
  };

  const handleConversationChange = (name) => {
    localStorage.setItem('receiver', name);
    setReceiverName(name);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const jsonString = JSON.stringify({
      message: inputMessage,
      sender: senderName,
      receiver: receiverName,
    });

    fetch('/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonString,
    })
      .then(response => response.json())
      .then(data => {
        setInputMessage('');
        fetchAndDisplayMessages();
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <main>
      <div className="message-card">
        <h2>{receiverName}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="user_message">Respond:</label>
          <br />
          <input
            type="text"
            id="user_message"
            name="user_message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <br />
          <input type="submit" value="Send" />
        </form>
        <div className="messages">
          {messages.map((message, index) => (
            <p key={index}>{`${message.sender}: ${message.message}`}</p>
          ))}
        </div>
      </div>
      <div className="conversation-buttons">
        {conversationChains.map((name, index) => (
          <button
            key={index}
            onClick={() => handleConversationChange(name)}
            name={name}
          >
            {name}
          </button>
        ))}
      </div>
      <button id="logout-button" onClick={handleLogout}>Logout</button>
    </main>
  );
}



















