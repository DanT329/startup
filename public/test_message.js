// Adjust the webSocket protocol to what is being used for HTTP
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

function sendMessage(e){
  e.preventDefault()
  const input = document.querySelector('input')
  if (input.value){
    socket.send(input.value)
    input.value = ""
  }
  input.focus()
}

document.querySelector('form').addEventListener('submit', sendMessage)

// Listen for Messages
socket.addEventListener('message',({data}) => {
  const li = document.createElement('li')
  li.textContent = data
  document.querySelector('ul').appendChild(li)
})

