var username = localStorage.getItem('newUserName');
if (username) { // If a username exists in local storage
  document.querySelector('header > p').textContent = username;
}

function logout() {
localStorage.removeItem('newUserName');
fetch(`/api/auth/logout`, {
  method: 'delete',
}).then(() => (window.location.href = 'login.html'));
}
document.getElementById('logout-button').addEventListener('click', logout);


// Adjust the webSocket protocol to what is being used for HTTP



//const protocol = window.location.protocol;


const socket = io(`ws://${window.location.host}`);

const sender = localStorage.getItem('newUserName')
const msgInput = document.querySelector('#message') 
const chatRoom = document.querySelector('#room') //change chat room to local value with key of sender and reciever name 
const usersList = document.querySelector('.user-list')
const chatDisplay = document.querySelector('.chat-display') 
const roomList = document.querySelector('.room-list')

function sendMessage(e){
  e.preventDefault()
   // replace 'sender' with the actual key
  if (msgInput.value){
    //const messageWithSender = `${sender}: ${msgInput.value}`;
    const msgData = {
      name: sender,
      text: msgInput.value
    };
    socket.emit('message', msgData);
    console.log('Message sent:', msgData);
    msgInput.value = "";
  }
  msgInput.focus()
}

function enterRoom(e){
  e.preventDefault()
  if(chatRoom.value){
    socket.emit('enterRoom', {
      name: sender,
      room: chatRoom.value
    })
  }
}

document.querySelector('.form-msg').addEventListener('submit', sendMessage)
document.querySelector('.form-join').addEventListener('submit', enterRoom)

// Listen for Messages
socket.on('message',(data) => {
  const {name, text, time} = data
  const li = document.createElement('li')
  li.className = 'post'
  console.log('message heard')
  if(name === sender) li.className = 'post post--left'
  if (name !== sender && name !== 'Admin') li.className = 'post post--right'

  if(name !== 'Admin'){
    li.innerHTML = `<div class="post__header ${name === sender? 'post__header--user': 'post__header--reply' }"><span class="post__header--name">${name}</span><span class="post__header--time">${time}</span></div><div class="post__text">${text}</div>`
  } else{
    li.innerHTML = `<div class="post__text">${text}</div>`
  }
  document.querySelector('.chat-display').appendChild(li)

  //chatDisplay.scrollTop = chatDisplay.scrollHeight
})

socket.on('userList',({users}) =>{
  showUsers(users)
})

socket.on('roomList',({rooms}) =>{
  showRooms(rooms)
})

function showUsers(users){
  usersList.textContent = ''
  if(users){
    usersList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
    users.forEach((user, i) =>{
      usersList.textContent += `${user.name}`
      if(users.length > 1 && i !== users.length - 1){
        usersList.textContent += ","
      }
    })
  }
}


function showRooms(rooms){
  roomList.textContent = ''
  if(rooms){
    roomList.innerHTML = `<em>Active Rooms:</em>`
    rooms.forEach((room, i) =>{
      roomList.textContent += `${room}`
      if(rooms.length > 1 && i !== rooms.length - 1){
        roomList.textContent += ","
      }
    })
  }
}
