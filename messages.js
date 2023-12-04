window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var receiverName = localStorage.getItem('receiver');
    var senderName = localStorage.getItem('newUserName');

    var main = document.querySelector('main');
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
  
    // Create the message card
    var messageCard = document.createElement('div');
    messageCard.className = 'message-card';

    var senderNameElement = document.createElement('h2');
    senderNameElement.innerText = receiverName;
    messageCard.appendChild(senderNameElement);

    var formElement = document.createElement('form');
    var labelElement = document.createElement('label');
    labelElement.setAttribute('for', 'user_message');
    labelElement.innerText = 'Respond:';
    formElement.appendChild(labelElement);
    formElement.appendChild(document.createElement('br'));

    var inputMessageElement = document.createElement('input');
    inputMessageElement.type = 'text';
    inputMessageElement.id = 'user_message';
    inputMessageElement.name = 'user_message';
    formElement.appendChild(inputMessageElement);
    formElement.appendChild(document.createElement('br'));

    var inputSubmitElement = document.createElement('input');
    inputSubmitElement.type = 'submit';
    inputSubmitElement.value = 'Send';
    formElement.appendChild(inputSubmitElement);

    messageCard.appendChild(formElement);




// Function to fetch and display messages
function fetchAndDisplayMessages() {
    fetch(`/api/conversation?user1=${encodeURIComponent(senderName)}&user2=${encodeURIComponent(receiverName)}`)
        .then(response => response.text())
        .then(data => {
            // Parse the JSON string back into an object
            var messages = JSON.parse(data);

            var messagesDiv = messageCard.querySelector('.messages');

            if (!messagesDiv) {
                messagesDiv = document.createElement('div');
                messagesDiv.className = 'messages';
                messageCard.insertBefore(messagesDiv, formElement);
            } else {
                messagesDiv.innerHTML = '';
            }

            messages.forEach(message => {
                var messageP = document.createElement('p');
                messageP.innerText = `${message.sender}: ${message.message}`;
                messagesDiv.appendChild(messageP);
            });
        })
        .catch(error => console.error('Error:', error));
}


// Call the function when the page loads
fetchAndDisplayMessages();
setInterval(fetchAndDisplayMessages, 5000);


// Function to create buttons
function createButtons() {
    fetch(`/api/uniqueConversations?user=${encodeURIComponent(senderName)}`)
        .then(response => response.json())
        .then(data => {
            // Get the main element
            var main = document.querySelector('main');
    
            // Iterate over each name in the data
            data.forEach(name => {
                // Check if a button with this name already exists
                if (!document.querySelector(`button[name="${name}"]`)) {
                    // Create a new button element
                    var button = document.createElement('button');
    
                    // Set the button text to the name
                    button.innerText = name;
    
                    // Set the button name attribute to the name
                    button.setAttribute('name', name);
    
                    // Add an event listener to the button click event
                    button.addEventListener('click', function() {
                        // Set the receiver local variable to the name
                        localStorage.setItem('receiver', name);
    
                        // Reload the page
                        location.reload();
                    });
    
                    // Add the button to the main element
                    main.appendChild(button);
                }
            });
        });
}

// Call the function when the page loads
createButtons();






    // Add an event listener to the form submit event
    formElement.addEventListener('submit', function(event) {
        // Prevent the form from being submitted
        event.preventDefault();

        // Get the message from the input field
        let message = inputMessageElement.value;
        console.log(message)
        console.log(senderName)
        console.log(receiverName)
        let jsonString = JSON.stringify({
            message: message,
            sender: senderName,
            receiver: receiverName
        });
        
        // Print the JSON string to the console
        console.log(jsonString);
        // Get the message from the input field

        // Convert the data to a JSON string

        // Send a POST request to the server
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
            // Clear the input field
            inputMessageElement.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        fetch(`/api/conversation?user1=${encodeURIComponent(senderName)}&user2=${encodeURIComponent(receiverName)}`)
            .then(response => response.text())
            .then(data => {
                // Parse the JSON string back into an object
            var messages = JSON.parse(data);

            var messagesDiv = messageCard.querySelector('.messages');

            if (!messagesDiv) {
             messagesDiv = document.createElement('div');
             messagesDiv.className = 'messages';
             messageCard.insertBefore(messagesDiv, formElement);
            } else {
            messagesDiv.innerHTML = '';
            }

            messages.forEach(message => {
            var messageP = document.createElement('p');
            messageP.innerText = `${message.sender}: ${message.message}`;
            messagesDiv.appendChild(messageP);
            });

                // Add the messages div to the message card
               
            })
            .catch(error => console.error('Error:', error));

            //make buttons for loading other messages
            fetch(`/api/uniqueConversations?user=${encodeURIComponent(senderName)}`)
            .then(response => response.json())
            .then(data => {
                // Get the main element
                var main = document.querySelector('main');
        
                // Iterate over each name in the data
                data.forEach(name => {
                    // Check if a button with this name already exists
                    if (!document.querySelector(`button[name="${name}"]`)) {
                        // Create a new button element
                        var button = document.createElement('button');
        
                        // Set the button text to the name
                        button.innerText = name;
        
                        // Set the button name attribute to the name
                        button.setAttribute('name', name);
        
                        // Add an event listener to the button click event
                        button.addEventListener('click', function() {
                            // Set the receiver local variable to the name
                            localStorage.setItem('receiver', name);
        
                            // Reload the page
                            location.reload();
                        });
        
                        // Add the button to the main element
                        main.appendChild(button);
                    }
                });
            });
        
                

            

    });

    // Add the message card to the main element
    main.appendChild(messageCard);
};
