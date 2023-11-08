document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var password = document.getElementById('password').value;
        if (name === 'Username' && password === 'Password') {
            window.location.href = 'users.html';
        } else {
            alert('Invalid username or password');
        }
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

