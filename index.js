function storeValues(event) {
    event.preventDefault();

    var name = document.getElementById('name').value;
    var time = document.getElementById('time').value;
    var workoutType = document.querySelector('select[name="varSelect1"]').value;
    var experienceLevel = document.querySelector('select[name="varSelect2"]').value;
    var password = document.getElementById('password').value;

    localStorage.setItem('name', name);
    localStorage.setItem('time', time);
    localStorage.setItem('workoutType', workoutType);
    localStorage.setItem('experienceLevel', experienceLevel);
    localStorage.setItem('password', password);

    window.location.href = 'users.html';
}

window.onload = function() {
    document.querySelector('input[type="submit"]').addEventListener('click', storeValues);
}