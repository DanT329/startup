// Adjust the webSocket protocol to what is being used for HTTP
//const protocol = window.location.protocol;
const socket = io(`ws://${window.location.host}`);

function sendMessage(e){
  e.preventDefault()
  const input = document.querySelector('input')
  const sender = localStorage.getItem('newUserName') // replace 'sender' with the actual key
  if (input.value){
    const messageWithSender = `${sender}: ${input.value}`;
    socket.emit('message', messageWithSender)
    input.value = ""
  }
  input.focus()
}


document.querySelector('form').addEventListener('submit', sendMessage)

// Listen for Messages
socket.on('message',(data) => {
  const li = document.createElement('li')
  li.textContent = data
  document.querySelector('ul').appendChild(li)
})


