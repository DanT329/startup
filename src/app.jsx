import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import {Login} from './login/login';
import {Users} from './users/users';
import {Messages} from './messages/messages';
import {Room} from './room/room';

export default function App() {
  return (
  <div className='app'>
    <header>
            <h1>Gym Buddy</h1>
            <nav>
              <menu>
                <li><a href="users.html">Users</a></li>
                <li><a href="messages.html">Private Messages</a></li>
                <li><a href="test_message.html">Public Chat</a></li>
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
            <span class="text-reset">Terry, Daniel</span>
            <br />
            <a href="https://github.com/DanT329/startup">GitHub</a>
          </footer>
    </div>
    );
}