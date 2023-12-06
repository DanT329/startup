// RoomForm.jsx
import React, { useState } from 'react';

const RoomForm = ({ socket }) => {
  const [chatRoom, setChatRoom] = useState('');

  const enterRoom = (e) => {
    e.preventDefault();

    if (chatRoom.trim() && socket) {
      socket.emit('enterRoom', {
        name: 'SenderName', // Replace with the actual sender's name
        room: chatRoom.trim(),
      });
    }
  };

  return (
    <form className="form-join" onSubmit={enterRoom}>
      <input
        type="text"
        id="room"
        placeholder="Chat Room"
        size="5"
        value={chatRoom}
        onChange={(e) => setChatRoom(e.target.value)}
        required
      />
      <button type="submit">Create Room</button>
    </form>
  );
};

export default RoomForm;
