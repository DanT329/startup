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
            <button type="button">Message</button>
        </div>
    `;

    for (var i = 0; i < 6; i++) {
        main.innerHTML += cardTemplate;
    }
});
