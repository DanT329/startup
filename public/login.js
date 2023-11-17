const DB = require('./database.js');
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var password = document.getElementById('password').value;
        fetch('api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                password: password
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unauthorized');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'users.html';
        })
        .catch((error) => {
            alert('Invalid username or password');
            console.error('Error:', error);
        });
    });

    document.getElementById('generate-activity').addEventListener('click', function() {
        fetch('https://www.boredapi.com/api/activity')
            .then(response => response.json())
            .then(data => {
                document.getElementById('activity-display').textContent = data.activity;
            })
            .catch(error => console.error('Error:', error));
    });
});


