window.onload = function() {
    var urlParams = new URLSearchParams(window.location.search);
    var receiverName = urlParams.get('receiver');
    var senderName = localStorage.getItem('newUserName');

    var messageCard = document.querySelector('.message-card');
    messageCard.querySelector('h2').innerText = receiverName;

    messageCard.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        var userMessage = document.getElementById('user_message').value;
        var messageParagraph = document.createElement('p');
        messageParagraph.innerText = senderName + " " + new Date().toLocaleTimeString() + ': ' + userMessage;
        messageCard.insertBefore(messageParagraph, messageCard.querySelector('form'));

        fetch('/api/Messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sender: senderName, receiver: receiverName, message: userMessage}),
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

    fetch('/api/Messages?receiver=' + encodeURIComponent(receiverName))
    .then(response => response.json())
    .then(messages => {
        messages.forEach(function(message) {
            var messageParagraph = document.createElement('p');
            messageParagraph.innerText = message.sender + " " + new Date(message.time).toLocaleTimeString() + ': ' + message.message;
            messageCard.insertBefore(messageParagraph, messageCard.querySelector('form'));
        });
    });
};
