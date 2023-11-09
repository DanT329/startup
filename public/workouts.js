let workouts = [];
let votes = {};

async function fetchWorkouts() {
    const response = await fetch('/workouts');
    const data = await response.json();
    workouts = data;
    renderWorkouts();
    console.log(workouts)
}

async function postWorkout(workout) {
    const response = await fetch('/workouts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
    });
    const data = await response.json();
    workouts.push(data);
    renderWorkouts();
}

async function vote(id, like) {
    const userId = localStorage.getItem('newUserName');
    console.log(id);
    console.log(like);
    const response = await fetch(`/workouts/${id}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ like, userId }),
    });
    const data = await response.json();
    const workout = workouts.find(w => w.id === id);
    workout.votes = data.votes;

    workouts = await fetch('/workouts');
    workouts = await workouts.json();
    renderWorkouts();
    
}

function renderWorkouts() {
    const container = document.getElementById('workouts');
    container.innerHTML = '';
    for (const workout of workouts) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>${workout.name}</h2>
            <p>${workout.description}</p>
            <button onclick="vote('${workout.id}', true)">Like</button>
            <button onclick="vote('${workout.id}', false)">Dislike</button>
            <p>${workout.votes ? workout.votes.likes : 0} likes, ${workout.votes ? workout.votes.dislikes : 0} dislikes</p>
        `;
        container.appendChild(card);
    }
}

document.getElementById('workoutForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const description = event.target.elements.description.value;
    postWorkout({ name, description });
});

fetchWorkouts();


