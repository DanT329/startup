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

    // confirm all fields are filled
    if(name == "" || time == "" || password == ""){
    alert('All fields must be filled');
    return; // stop execution of the function if fields are empty
    }

    fetch('/api/auth/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
    })
    .then(response => {
        if (response.status === 409) {
            throw new Error('Username already exists');
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success with token:', data);
        localStorage.setItem('newUserName', name);
        window.location.href = 'users.html';
    })
    .catch((error) => {
        alert(error.message);
        console.error('Error:', error);
    });

}

window.onload = function() {
    document.querySelector('input[type="submit"]').addEventListener('click', storeValues);
}


