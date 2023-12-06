// UserList.jsx
import React, { useState, useEffect } from 'react';

const UserList = ({ socket }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('userList', ({ users }) => {
      setUsers(users);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('userList');
    };
  }, [socket]);

  return (
    <p className="user-list">
      <em>Users in the chat room:</em> {users.join(', ')}
    </p>
  );
};

export default UserList;
