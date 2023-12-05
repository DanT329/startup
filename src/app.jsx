import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import {Account} from './account/account';
import {Users} from './users/users';
import {Messages} from './messages/messages';
import {Room} from './room/room';
import {Login} from './login/login';

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
  }

export default function App() {
  const handleLogout = () => {
    localStorage.removeItem('newUserName');
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => navigate('/login'));
  };
  return (
    <BrowserRouter>
  <div className='app'>
    <header>
            <h1>Gym Buddy</h1>
            <nav>
              <menu>
                <li><NavLink to="login">Login</NavLink></li>
                <li><NavLink to="main">Creat Account</NavLink></li>
                <li><NavLink to="users">Users</NavLink></li>
                <li><NavLink to="messages">Private Messages</NavLink></li>
                <li><NavLink to="test_message">Public Chat</NavLink></li>
              </menu>
            </nav>
            <p></p>
            <button id="logout-button" onClick={handleLogout}>Logout</button>
            <hr/>
        </header>

        <main>
           
        </main>
        <Routes>
            <Route path='/main' element={<Account />} exact />
            <Route path='/users' element={<Users />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/test_message' element={<Room />} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
        <footer>
            <hr />
            <span className="text-reset">Terry, Daniel</span>
            <br />
            <a href="https://github.com/DanT329/startup">GitHub</a>
          </footer>
    </div>
    </BrowserRouter>
    );
}