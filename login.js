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
            if (response.status !== 201) { // Check for a 201 status code
                throw new Error('Unauthorized');
            }
            return response.text(); // Expect a plain text response
        })
        .then(data => {
            console.log('Success:', data);
            localStorage.setItem('newUserName', name); // Set the Local Storage variable
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
