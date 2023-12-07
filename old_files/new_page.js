// Retrieve sender and receiver
var sender = localStorage.getItem("newUserName");
var receiver = localStorage.getItem("receiver");

var socket;

function connectWebSocket() {
  // Close existing connection if it exists
  if (socket) {
    socket.close();
  }

  // Create WebSocket connection
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
  

  // Connection opened
  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
  });



  // Listen for messages
  socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    var messageCard = document.createElement("div");
    var header = document.createElement("h2");
    header.innerHTML = "Chat with " + receiver;
    messageCard.appendChild(header);
    var message = document.createElement("p");
    message.innerHTML = event.data;
    messageCard.appendChild(message);
    document.body.appendChild(messageCard);

    // Post the message to the database
    let jsonString = JSON.stringify({
      message: event.data,
      sender: sender,
      receiver: receiver
    });

    fetch('/api/conversation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonString,
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
}

function displayMessage(message) {
    // Create a new div for the message
    var messageDiv = document.createElement("div");

    // Create a new paragraph for the message text
    var messageText = document.createElement("p");
    messageText.textContent = message;

    // Append the message text to the message div
    messageDiv.appendChild(messageText);

    // Append the message div to the message card
    var messageCard = document.getElementById("messageCard");
    messageCard.appendChild(messageDiv);
}


// Define a function to fetch and display past messages on page load
function fetchAndDisplayMessages() {
    fetch(`/api/conversation?user1=${encodeURIComponent(sender)}&user2=${encodeURIComponent(receiver)}`)
        .then(response => response.text())
        .then(data => {
            // Parse the JSON string back into an object
            var messages = JSON.parse(data);

            messages.forEach(message => {
                displayMessage(message);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Call the function when the page loads
window.addEventListene('load', function() {
  connectWebSocket();
  fetchAndDisplayMessages();

  // Create input field
  var messageInput = document.createElement("input");
  messageInput.type = "text";
  messageInput.id = "messageInput";
  messageInput.placeholder = "Type your message here...";
  document.body.appendChild(messageInput);

  // Create send button
  var sendButton = document.createElement("button");
  sendButton.id = "sendButton";
  sendButton.innerHTML = "Send";
  document.body.appendChild(sendButton);

  // Send message when the send button is clicked
  sendButton.addEventListener("click", function() {
    var message = messageInput.value;
    socket.send(JSON.stringify({ type: 'message', sender: sender, receiver: receiver, message: message }));
  });

  // Send message when the Enter key is pressed
  messageInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      sendButton.click();
    }
  });
});

