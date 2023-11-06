window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var receiverName = urlParams.get('receiver');
    var senderName = urlParams.get('sender');

    var messageCard = document.querySelector('.message-card');

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
                var button = document.createElement('button');
                button.className = 'my-button-class';
                button.innerText = receiverName;
                button.addEventListener('click', function() {
                    window.location.href = link;
                });
                document.body.appendChild(button);
            });
        });
    } else {
        messageCard.querySelector('h2').innerText = receiverName;

        messageCard.querySelector('form').addEventListener('submit', function(event) {
            event.preventDefault();

            var userMessage = document.getElementById('user_message').value;
            var currentTime = new Date().toLocaleTimeString();
            var messageParagraph = document.createElement('p');
            messageParagraph.innerText = senderName + " " + currentTime + ': ' + userMessage;
            messageCard.insertBefore(messageParagraph, messageCard.querySelector('form'));

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
