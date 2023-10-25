function storeValues(event) {
    event.preventDefault();

    var name = document.getElementById('name').value;
    var time = document.getElementById('time').value;
    var workoutType = document.querySelector('select[name="varSelect1"]').value;
    var experienceLevel = document.querySelector('select[name="varSelect2"]').value;
    var password = document.getElementById('password').value;

    localStorage.setItem('Username', name);
    localStorage.setItem('time', time);
    localStorage.setItem('workoutType', workoutType);
    localStorage.setItem('experienceLevel', experienceLevel);
    localStorage.setItem('password', password);

    
    var usersData = JSON.parse(localStorage.getItem('usersData')) || [];

    
    usersData.push({
        name: name,
        time: time,
        workoutType: workoutType,
        experienceLevel: experienceLevel,
        rating: '★★★☆☆'  
    });

    localStorage.setItem('usersData', JSON.stringify(usersData));

    window.location.href = 'users.html';
}

window.onload = function() {
    document.querySelector('input[type="submit"]').addEventListener('click', storeValues);
}

// Place holder array of user data
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