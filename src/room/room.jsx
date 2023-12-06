import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { connectToWebSocket } from './RoomSocket'; // Adjust the path accordingly

export function Room() {
    const [socket, setSocket] = useState(null);
  
    useEffect(() => {
      const newSocket = connectToWebSocket();
  
      // Log when the connection is established
      newSocket.on('connect', () => {
        console.log('WebSocket connected');
      });
  
      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }, []);
  
    return (
      <main className='container-fluid bg-secondary text-center'>
        <div>Room displayed here</div>
      </main>
    );
  }


