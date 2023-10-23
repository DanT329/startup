document.addEventListener('DOMContentLoaded', function() {
    var name = localStorage.getItem('name');
    document.querySelector('header p').innerText = name;

    var main = document.querySelector('main');
    var cardTemplate = `
        <div class="profile-card">
            <h2>Name: ${name}</h2>
            <p>Time: ${localStorage.getItem('time')}</p>
            <p>Level: ${localStorage.getItem('experienceLevel')}</p>
            <p>Type: ${localStorage.getItem('workoutType')}</p>
            <p>User Rating: ★★★★☆</p>
            <button type="button" class="message-button">Message</button>
        </div>
    `;

    for (var i = 0; i < 6; i++) {
        main.innerHTML += cardTemplate;
    }

    var messageButtons = document.querySelectorAll('.message-button');
    messageButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var card = this.parentElement;
            localStorage.setItem('cardName', card.querySelector('h2').innerText);
            localStorage.setItem('cardTime', card.querySelector('p').innerText);
            localStorage.setItem('cardLevel', card.querySelectorAll('p')[1].innerText);
            localStorage.setItem('cardType', card.querySelectorAll('p')[2].innerText);
            localStorage.setItem('cardRating', card.querySelectorAll('p')[3].innerText);
            window.location.href = 'messages.html';
        });
    });
});

