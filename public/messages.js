window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var receiverName = urlParams.get('receiver');
    var senderName = urlParams.get('sender');

    var main = document.querySelector('main');

    // If there's no appended data
    if (!receiverName || !senderName) {
        // Fetch the links for the sender
        senderName = localStorage.getItem('newUserName');
        console.log(encodeURIComponent(senderName));
        console.log('NO DATA');
        fetch('/api/UserMessages?sender=' + encodeURIComponent(senderName))
        .then(response => response.json())
        .then(links => {
            console.log('Links:', links); // Log the links
            links.forEach(function(link) {
                // Parse the link to get the receiver
                console.log('NO DATA 2');
                var url = new URL(link);
                receiverName = url.searchParams.get('receiver');

                // Create a button with the receiver's name
                var buttonContainer = document.getElementById('buttonContainer');
                var button = document.createElement('button');
                button.className = 'my-button-class';
                button.innerText = receiverName;
                button.addEventListener('click', function() {
                    window.location.href = link;
                });
                buttonContainer.appendChild(button);
            });
        });
    } else {
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

        // Add the message card to the main element
        main.appendChild(messageCard);

        // Add the link to UserMessages when a new message chain is started
        fetch('/api/UserMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: senderName, receiver: receiverName, link: window.location.href }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        messageCard.querySelector('form').addEventListener('submit', function(event) {
            event.preventDefault();

            var userMessage = document.getElementById('user_message').value;
            var currentTime = new Date().toLocaleTimeString();
            var messageParagraph = document.createElement('p');
            messageParagraph.innerText = senderName + " " + currentTime + ': ' + userMessage;
            messageCard.insertBefore(messageParagraph, messageCard.querySelector('form'));

            fetch('/api/Messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({sender: senderName, receiver: receiverName, message: userMessage, time: currentTime}),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            document.getElementById('user_message').value = '';
        });

        fetch('/api/Messages?sender=' + encodeURIComponent(senderName) + '&receiver=' + encodeURIComponent(receiverName))
        .then(response => response.json())
        .then(messages => {
            messages.forEach(function(message) {
                var messageParagraph = document.createElement('p');
                messageParagraph.innerText = message.sender + " " + message.time + ': ' + message.message;
                messageCard.insertBefore(messageParagraph, messageCard.querySelector('form'));
            });
        });
    }
};

