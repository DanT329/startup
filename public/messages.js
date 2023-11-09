window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var receiverName = localStorage.getItem('receiver');
    var senderName = localStorage.getItem('newUserName');

    var main = document.querySelector('main');
    var username = localStorage.getItem('newUserName');
    if (username) { // If a username exists in local storage
        document.querySelector('header > p').textContent = username;
    }

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

                // Create a div to hold the messages
                var messagesDiv = document.createElement('div');
                messagesDiv.className = 'messages';

                // Iterate over each message
                messages.forEach(message => {
                    // Create a p element for the message
                    var messageP = document.createElement('p');
                    messageP.innerText = `${message.sender}: ${message.message}`;

                    // Add the message to the messages div
                    messagesDiv.appendChild(messageP);
                });

                // Add the messages div to the message card
                messageCard.insertBefore(messagesDiv, formElement);
            })
            .catch(error => console.error('Error:', error));
    });

    // Add the message card to the main element
    main.appendChild(messageCard);
};
