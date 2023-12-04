import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import {Login} from './login/login';
import {Users} from './users/users';
import {Messages} from './messages/messages';
import {Room} from './room/room';

export default function App() {
  return (
    <BrowserRouter>
  <div className='app'>
    <header>
            <h1>Gym Buddy</h1>
            <nav>
              <menu>
                <li><NavLink to="users">Users</NavLink></li>
                <li><NavLink to="messages">Private Messages</NavLink></li>
                <li><NavLink to="test_message">Public Chat</NavLink></li>
              </menu>
            </nav>
            <p></p>
              <button id="logout-button">Logout</button>
            <hr/>
        </header>

        <main>
            <Login/>
            <Users />
            <Room />
            <Messages />
        </main>
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