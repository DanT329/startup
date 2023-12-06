import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './user.css';

export function Users() {
  const [cardsData, setCardsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/UsersData')
      .then((response) => {
        if (!response.ok) {
          throw Error(response.status);
        }
        return response.json();
      })
      .then((data) => {
        setCardsData(data);
      })
      .catch((error) => {
        if (error.message === '401') {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('newUserName');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => navigate('/login'));
  };

  const handleMessage = (receiverName) => {
    localStorage.setItem('receiver', receiverName);
    navigate('/messages');
  };

  return (
    <main className='users-main'>
  
      {cardsData.map((cardData) => (
        <div className='users-profile-card' key={cardData.name}>
          <h2>{cardData.name}</h2>
          <p>Time: {cardData.time}</p>
          <p>Level: {cardData.experienceLevel}</p>
          <p>Type: {cardData.workoutType}</p>
          <p>User Rating: ★★★★☆</p>
          <button type='button' className='users-message-button' onClick={() => handleMessage(cardData.name)}>
            Message
          </button>
        </div>
      ))}
    </main>
  );
}
