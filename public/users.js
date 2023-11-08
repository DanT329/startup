document.addEventListener('DOMContentLoaded', function() {
    var main = document.querySelector('main');
    var username = localStorage.getItem('newUserName');
    if (username) { // If a username exists in local storage
        document.querySelector('header > p').textContent = username;
    }

    fetch('/api/UsersData')
    .then(response => response.json())
    .then(cardsData => {
        cardsData.forEach(function(cardData) {
            var cardTemplate = `
                <div class="profile-card">
                    <h2>Name: ${cardData.name}</h2>
                    <p>Time: ${cardData.time}</p>
                    <p>Level: ${cardData.experienceLevel}</p>
                    <p>Type: ${cardData.workoutType}</p>
                    <p>User Rating: ★★★★☆</p>
                    <button type="button" class="message-button">Message</button>
                </div>
            `;

            main.innerHTML += cardTemplate;
        });

        var messageButtons = document.querySelectorAll('.message-button');
        messageButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var card = this.parentElement;
                var receiverName = card.querySelector('h2').innerText;
                var senderName = localStorage.getItem('newUserName'); // Replace this with the actual sender's name
                window.location.href = 'messages.html?receiver=' + encodeURIComponent(receiverName) + '&sender=' + encodeURIComponent(senderName);
            });
        });
    });
});


