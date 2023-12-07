import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

export function Room() {
  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io('http://localhost:3000', { path: '/ws' });

    // You can add your socket event listeners or perform other actions here
    // For example:
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Don't forget to clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <p>This is the rooms component</p>
      {/* Add your component content here */}
    </div>
  );
}


