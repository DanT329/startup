import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [activity, setActivity] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          password: password,
        }),
      });

      if (response.status !== 201) {
        throw new Error('Unauthorized');
      }

      const data = await response.text();
      console.log('Success:', data);
      localStorage.setItem('newUserName', name);
      // Use the navigate function to navigate to the 'Users' screen
      navigate('/users');
    } catch (error) {
      alert('Invalid username or password');
      console.error('Error:', error);
    }
  };

  const handleGenerateActivity = async () => {
    try {
      const response = await fetch('https://www.boredapi.com/api/activity');
      const data = await response.json();
      setActivity(data.activity);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main>
      <p>Login To Continue</p>
      <form onSubmit={handleLogin}>
        <label htmlFor="name">Name:</label><br />
        <input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} /><br />
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" name="varPassword" required value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <input type="submit" value="Submit" />
      </form>
      <p id="bored">Bored?</p>
      <button id="generate-activity" onClick={handleGenerateActivity}>Generate Activity</button>
      <p id="activity-display">{activity}</p>
    </main>
  );
}
