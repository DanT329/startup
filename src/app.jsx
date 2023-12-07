import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Account } from './account/account';
import { Users } from './users/users';
import { Messages } from './messages/messages';
import { Login } from './login/login';

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const isUserLoggedIn = !!localStorage.getItem('newUserName'); // Convert to boolean
  const userName = localStorage.getItem('newUserName');

  const handleLogout = () => {
    // Check if newUserName is present before performing logout
    if (isUserLoggedIn) {
      localStorage.removeItem('newUserName');
      fetch(`/api/auth/logout`, {
        method: 'delete',
      }).then(() => navigate('/login'));
    } else {
      // Handle the case where newUserName is not present
      console.log('No user is logged in.'); // You can adjust this according to your requirements
    }
  };

  return (
    <div className='app'>
      <header>
        <h1>Gym Buddy</h1>
        <nav>
          <menu>
            <li><NavLink to="login">Login</NavLink></li>
            {!isUserLoggedIn && <li><NavLink to="main">Create Account</NavLink></li>}
            {isUserLoggedIn && <li><NavLink to="users">Users</NavLink></li>}
            {isUserLoggedIn && <li><NavLink to="messages">Private Messages</NavLink></li>}
          </menu>
        </nav>
        {isUserLoggedIn && <p>User: {userName}</p>}
        <p></p>
        {isUserLoggedIn && <button id="logout-button" onClick={handleLogout}>Logout</button>}
        <hr />
      </header>

      <main>
        <Routes>
          {!isUserLoggedIn && <Route path='/main' element={<Account />} exact />}
          {isUserLoggedIn && <Route path='/users' element={<Users />} />}
          {isUserLoggedIn && <Route path='/messages' element={<Messages />} />}
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </main>

      <footer>
        <hr />
        <span className="text-reset">Terry, Daniel</span>
        <br />
        <a href="https://github.com/DanT329/startup">GitHub</a>
      </footer>
    </div>
  );
}

