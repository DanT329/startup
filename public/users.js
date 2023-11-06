document.addEventListener('DOMContentLoaded', function() {
    var name = localStorage.getItem('Username');
    document.querySelector('header p').innerText = name;

    var main = document.querySelector('main');

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
                localStorage.setItem('cardName', card.querySelector('h2').innerText);
                localStorage.setItem('cardTime', card.querySelector('p').innerText);
                localStorage.setItem('cardLevel', card.querySelectorAll('p')[1].innerText);
                localStorage.setItem('cardType', card.querySelectorAll('p')[2].innerText);
                localStorage.setItem('cardRating', card.querySelectorAll('p')[3].innerText);
                card.remove();
                window.location.href = 'messages.html';
            });
        });
    });
});


