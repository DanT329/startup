document.addEventListener('DOMContentLoaded', function() {
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

    fetch('/api/UsersData')
    .then(response => {
      if (!response.ok) {
        throw Error(response.status);
      }
      return response.json();
    })
    .then(cardsData => {
      cardsData.forEach(function(cardData) {
        var cardTemplate = `
          <div class="profile-card">
              <h2>${cardData.name}</h2>
              <p>Time: ${cardData.time}</p>
              <p>Level: ${cardData.experienceLevel}</p>
              <p>Type: ${cardData.workoutType}</p>
              <p>User Rating: ★★★★☆</p>
              <button type="button" class="message-button">Message</button>
          </div>
        `;
    
        main.innerHTML += cardTemplate;
      });
    
      // Adding message button event handlers after all profile cards are added
      var messageButtons = document.querySelectorAll('.message-button');
      messageButtons.forEach(function(button) {
        button.addEventListener('click', function() {
          var card = this.parentElement;
          var receiverName = card.querySelector('h2').innerText;
          var senderName = localStorage.getItem('newUserName'); // Replace this with the actual sender's name
          window.location.href = 'messages.html?receiver=' + encodeURIComponent(receiverName) + '&sender=' + encodeURIComponent(senderName);
          localStorage.setItem('receiver', receiverName );
          console.log('receiver');
        });
      });
    })
    .catch(error => {
        if (error.message == '401') {
            window.location.href = 'login.html';
        }
    });

      
    });



