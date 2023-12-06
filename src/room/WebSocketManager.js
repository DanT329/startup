// WebSocketManager.js

import { io } from 'socket.io-client';

class WebSocketManager {
  constructor() {
    this.socket = io(); // Initialize the socket connection
    this.msgInput = null;
    this.chatRoom = null;
    this.usersList = null;
    this.chatDisplay = null;
    this.roomList = null;

    // Bind methods to the class instance
    this.sendMessage = this.sendMessage.bind(this);
    this.enterRoom = this.enterRoom.bind(this);

    // Set up event listeners
    this.socket.on('message', this.handleMessage.bind(this));
    this.socket.on('userList', this.handleUserList.bind(this));
    this.socket.on('roomList', this.handleRoomList.bind(this));

    // Connect to the socket
    this.socket.on('connect', () => {
      console.log('Connected to the WebSocket');
    });

    // Log other socket events
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to the WebSocket (attempt ' + attemptNumber + ')');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('WebSocket reconnection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  sendMessage(e) {
    e.preventDefault();
    if (this.msgInput.value) {
      const msgData = {
        name: this.sender,
        text: this.msgInput.value,
      };
      this.socket.emit('message', msgData);
      console.log('Message sent:', msgData);
      this.msgInput.value = '';
    }
    this.msgInput.focus();
  }

  enterRoom(e) {
    e.preventDefault();
    if (this.chatRoom.value) {
      this.socket.emit('enterRoom', {
        name: this.sender,
        room: this.chatRoom.value,
      });
    }
  }

  handleMessage(data) {
    const { name, text, time } = data;
    const li = document.createElement('li');
    li.className = 'post';
    console.log('message heard');
    if (name === this.sender) li.className = 'post post--left';
    if (name !== this.sender && name !== 'Admin') li.className = 'post post--right';

    if (name !== 'Admin') {
      li.innerHTML = `<div class="post__header ${
        name === this.sender ? 'post__header--user' : 'post__header--reply'
      }"><span class="post__header--name">${name}</span><span class="post__header--time">${time}</span></div><div class="post__text">${text}</div>`;
    } else {
      li.innerHTML = `<div class="post__text">${text}</div>`;
    }
    this.chatDisplay.appendChild(li);
  }

  handleUserList({ users }) {
    this.showUsers(users);
  }

  handleRoomList({ rooms }) {
    this.showRooms(rooms);
  }

  showUsers(users) {
    this.usersList.textContent = '';
    if (users) {
      this.usersList.innerHTML = `<em>Users in ${this.chatRoom.value}:</em>`;
      users.forEach((user, i) => {
        this.usersList.textContent += `${user.name}`;
        if (users.length > 1 && i !== users.length - 1) {
          this.usersList.textContent += ',';
        }
      });
    }
  }

  showRooms(rooms) {
    this.roomList.textContent = '';
    if (rooms) {
      this.roomList.innerHTML = `<em>Active Rooms:</em>`;
      rooms.forEach((room, i) => {
        let roomButton = document.createElement('button');
        roomButton.textContent = room;
        roomButton.addEventListener('click', (e) => {
          this.chatRoom.value = room; // Change the value of chatRoom
          this.enterRoom(e); // Call the enterRoom function
        });
        this.roomList.appendChild(roomButton);
        if (rooms.length > 1 && i !== rooms.length - 1) {
          this.roomList.appendChild(document.createTextNode(','));
        }
      });
    }
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default WebSocketManager;

