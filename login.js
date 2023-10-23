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
});
