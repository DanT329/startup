import React, { useState } from 'react';
import {NavLink, Navigate, useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';

export function Account() {
  // state variables for form inputs
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [password, setPassword] = useState('');

  // state variable for error message
  const [error, setError] = useState('');

  // get the history object
  const navigate = useNavigate();

  // function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted!');

    // create a new user object
    var newUser = {
      name: name,
      time: time,
      experienceLevel: experienceLevel,
      workoutType: workoutType,
      rating: '★★★☆☆',
      password: password,
    };

    // confirm all fields are filled
    if (name === '' || time === '' || password === '') {
      setError('All fields must be filled');
      return; // stop execution of the function if fields are empty
    }

    // clear the error message
    setError('');

    // send a POST request to the backend service
    fetch('/api/auth/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (response.status === 409) {
          throw new Error('Username already exists');
        } else if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success with token:', data);
        localStorage.setItem('newUserName', name);
        // navigate to the Users page
       navigate('/users');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error:', error);
      });
  };

  // function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'time':
        setTime(value);
        break;
      case 'workoutType':
        setWorkoutType(value);
        break;
      case 'experienceLevel':
        setExperienceLevel(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // return the JSX code for rendering the form
  return (
    <main className='container-fluid bg-secondary text-center'>
      <div>Account displayed here</div>
      <a href='login.html'>Already Have An Account: Login</a>
      <p>Create An Account</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='name'>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type='text'
            name='name'
            value={name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId='time'>
          <Form.Label>Workout Time: </Form.Label>
          <Form.Control
            type='time'
            name='time'
            value={time}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId='workoutType'>
          <Form.Label>Workout Type: </Form.Label>
          <Form.Control
            as='select'
            name='workoutType'
            value={workoutType}
            onChange={handleChange}
            required
          >
            <option selected disabled value=''>
              Select an option
            </option>
            <option>Cardio</option>
            <option>Strength</option>
            <option>Mix</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='experienceLevel'>
          <Form.Label>Experience Level: </Form.Label>
          <Form.Control
            as='select'
            name='experienceLevel'
            value={experienceLevel}
            onChange={handleChange}
            required
          >
            <option selected disabled value=''>
              Select an option
            </option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type='text'
            name='password'
            value={password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type='submit'>Submit</Button>
      </Form>
      <br />
      {error && <Alert variant='danger'>{error}</Alert>}
    </main>
  );
}

