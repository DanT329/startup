window.onload = function() {
    var name = localStorage.getItem('Username');
    document.querySelector('header p').innerText = name;

    var messageCard = document.querySelector('.message-card');
    messageCard.querySelector('h2').innerText = name;
   // messageCard.querySelector('p').innerText = name + ' at ' + localStorage.getItem('time') + ': random words a human might say.';

    messageCard.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        var userMessage = document.getElementById('user_message').value;
        var messageParagraph = document.createElement('p');
        messageParagraph.innerText = name + " " + new Date().toLocaleTimeString() + ': ' + userMessage;
        messageCard.insertBefore(messageParagraph, messageCard.querySelector('form'));

        var messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push({name: name, time: new Date(), message: userMessage});
        localStorage.setItem('messages', JSON.stringify(messages));
        document.getElementById('user_message').value = '';
    });
}
