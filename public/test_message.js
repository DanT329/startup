// Adjust the webSocket protocol to what is being used for HTTP
//const protocol = window.location.protocol;
const socket = io(`ws://${window.location.host}`);

const sender = localStorage.getItem('newUserName')
const msgInput = document.querySelector('#message') 
const chatRoom = localStorage.getItem('#room') 
const usersList = localStorage.getItem('.user-list')
const chatDisplay = localStorage.getItem('.chat-display') 
const roomList = localStorage.getItem('.room-list')

function sendMessage(e){
  e.preventDefault()
   // replace 'sender' with the actual key
  if (msgInput.value){
    //const messageWithSender = `${sender}: ${msgInput.value}`;
    socket.emit('message', {
      name: sender,
      text: msgInput.value
    })
    msgInput.value = ""
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
  if(name === sender) li.className = 'post post--left'
  if (name !== sender && name !== 'Admin') li.className = 'post post--right'

  if(name !== 'Admin'){
    li.innerHTML = `<dive class="post__header ${name === sender? 'poast__header--user': 'post__header--reply' }"><span class="post__header--name">${name}</span><span class="post__header--time">${time}</span></div><div class="post__text">${text}</div>`
  } else{
    li.innterHTML = `<div class="post__text">${text}</div>`
  }
  document.querySelector('.chat-display').appendChild(li)

  chatDisplay.scrollTop = chatDisplay.scrollHeight
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
    usersList.innterHTML = `<em>Users in ${chatRoom.value}:</em>`
    users.forEach((user, i) =>{
      usersList.textContent += `${user.name}`
      if(user.length > 1 && i !== users.length - 1){
        usersList.textContent += ","
      }
    })
  }
}

function showRooms(rooms){
  roomList.textContent = ''
  if(rooms){
    roomList.innterHTML = `<em>Active Rooms:</em>`
    rooms.forEach((room, i) =>{
      roomList.textContent += `${room}`
      if(rooms.length > 1 && i !== rooms.length - 1){
        roomList.textContent += ","
      }
    })
  }
}
