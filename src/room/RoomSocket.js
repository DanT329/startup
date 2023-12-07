import io from 'socket.io-client';

var username = localStorage.getItem('newUserName');
//if (username) { // If a username exists in local storage
  //document.querySelector('header > p').textContent = username;
//}

//document.getElementById('logout-button').addEventListener('click', logout);

const socket = io('/ws');

//const sender = localStorage.getItem('newUserName')
//const msgInput = document.querySelector('#message') 
//const chatRoom = document.querySelector('#room') //change chat room to local value with key of sender and reciever name 
//const usersList = document.querySelector('.user-list')
//const chatDisplay = document.querySelector('.chat-display') 
//const roomList = document.querySelector('.room-list')

const connectToWebSocket = () => {
    const socket = io('/ws'); // Replace with your WebSocket server URL
  
    // Additional logic or event listeners can be added here if needed
  
    return socket;
  };


export { connectToWebSocket };