document.addEventListener('DOMContentLoaded', function() {
    var name = localStorage.getItem('Username');
    document.querySelector('header p').innerText = name;

    var main = document.querySelector('main');

    // Place holder array of user
    var usersData = [
        {
            name: 'User1',
            time: '07:00AM',
            experienceLevel: 'Beginner',
            workoutType: 'Cardio',
            rating: '★★★☆☆'
        },
        {
            name: 'User2',
            time: '04:00AM',
            experienceLevel: 'Intermediate',
            workoutType: 'Cardio',
            rating: '★★★★☆'
        },
        {
            name: 'User3',
            time: '09:00AM',
            experienceLevel: 'Advanced',
            workoutType: 'Srength',
            rating: '★★★★★'
        }
    ];
    
    localStorage.setItem('usersData', JSON.stringify(usersData));
    
    var cardsData = JSON.parse(localStorage.getItem('usersData')) || [];

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

