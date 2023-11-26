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
    const messageWithSender = `${sender}: ${msgInput.value}`;
    socket.emit('message', messageWithSender)
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
  const li = document.createElement('li')
  li.textContent = data
  document.querySelector('ul').appendChild(li)
})


