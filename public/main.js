function storeValues(event) {
    event.preventDefault();
    console.log('Form submitted!');

    var name = document.getElementById('name').value;
    var time = document.getElementById('time').value;
    var workoutType = document.querySelector('select[name="varSelect1"]').value;
    var experienceLevel = document.querySelector('select[name="varSelect2"]').value;
    var password = document.getElementById('password').value;

    var newUser = {
        name: name,
        time: time,
        password: password,
        workoutType: workoutType,
        experienceLevel: experienceLevel,
        rating: '★★★☆☆',  
        
    };
    if (localStorage.getItem('newUserName') === null) {
        // If not, store the new user's name in local storage
        localStorage.setItem('newUserName', name);
    }

    fetch('/api/auth/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success with token:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    fetch('/api/UsersData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        window.location.href = 'users.html';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

window.onload = function() {
    document.querySelector('input[type="submit"]').addEventListener('click', storeValues);
}
