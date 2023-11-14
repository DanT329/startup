const express = require('express');
const app = express();
const uuid = require('uuid');
const DB = require('./database.js');
var UsersData = [];
var MessagesData = [];
var UserMessages = [];
let conversations = {};

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetUsersData
apiRouter.get('/UsersData', (_req, res) => {
    res.send(UsersData);
  });

// PostUsersData
apiRouter.post('/UsersData', (req, res) => {
    DB.addUser(req.body);
    //UsersData.push(req.body);
    res.status(201).send(req.body);
});

// GetMessagesData
apiRouter.get('/Messages', (req, res) => {
    var sender = req.query.sender;
    var receiver = req.query.receiver;

    var conversation = MessagesData.filter(message => message.sender === sender && message.receiver === receiver);
    res.send(conversation);
});


// PostMessagesData
apiRouter.post('/Messages', (req, res) => {
    MessagesData.push(req.body);
    res.status(201).send(req.body);
});


// PostUserMessages
apiRouter.post('/UserMessages', (req, res) => {
    const { sender, receiver, link } = req.body;
    const existingMessage = UserMessages.find(message => message.sender === sender && message.receiver === receiver && message.link === link);
    if (!existingMessage) {
        UserMessages.push({ sender, receiver, link });
    }
    res.status(201).send(req.body);
});


apiRouter.get('/UserMessages', (req, res) => {
    var user = req.query.user;

    // Get the links for the user
    var links = UserMessages.filter(userMessage => userMessage.sender === user || userMessage.receiver === user).map(userMessage => userMessage.link);
    console.log('Links:', links); // Log the links
    res.send(links);
});



app.post('/api/conversation', (req, res) => {
  console.log(req.body)
  let sender = req.body.sender;
  let receiver = req.body.receiver;
  let message = req.body.message;

  addMessage(sender, receiver, message);

  res.status(200).send({ status: 'Message added successfully' });
});

// Define the getMessages function
function getMessages(user1, user2) {
    // Create a unique key for the conversation
    let key = [user1, user2].sort().join('-');
  
    // Check if the conversation exists
    if (conversations[key]) {
      // Return the conversation in a format that's easy to stringify
      return JSON.stringify(conversations[key]);
    } else {
      // If the conversation doesn't exist, return an empty array
      return JSON.stringify([]);
    }
  }
  
  // Define the API endpoint
  apiRouter.get('/conversation', (req, res) => {
    let user1 = req.query.user1;
    let user2 = req.query.user2;
    console.log('get conversation:')
  
    // Get the message chain between the two users
    let messages = getMessages(user1, user2);
  
    // Send the message chain as the response
    res.send(messages);
  });


function addMessage(sender, receiver, message) {
  // Create a unique key for the conversation
  let key = [sender, receiver].sort().join('-');

  // If the conversation doesn't exist, create it
  if (!conversations[key]) {
      conversations[key] = [];
  }

  // Append the message to the conversation
  conversations[key].push({ sender: sender, message: message });
}

// Define the getUniqueConversations function
function getUniqueConversations(user) {
  // Initialize an empty array to hold the unique conversation partners
  let uniqueConversations = [];

  // Iterate over each conversation
  for (let key in conversations) {
      // Split the key into the two usernames
      let users = key.split('-');

      // Check if the given user is part of the conversation
      if (users.includes(user)) {
          // Find the other user in the conversation
          let otherUser = users[0] === user ? users[1] : users[0];

          // Add the other user to the array if they're not already in it
          if (!uniqueConversations.includes(otherUser)) {
              uniqueConversations.push(otherUser);
          }
      }
  }

  // Return the array of unique conversation partners
  return uniqueConversations;
}


// Define the API endpoint
apiRouter.get('/uniqueConversations', (req, res) => {
  let user = req.query.user;
  console.log('get unique conversations:')

  // Get the unique conversation partners for the user
  let uniqueConversations = getUniqueConversations(user);

  // Send the list of unique conversation partners as the response
  res.json(uniqueConversations);
});


let workouts = [];
let votes = {};

app.get('/workouts', (req, res) => {
    res.json(workouts);
});

app.post('/workouts', (req, res) => {
    const workout = req.body;
    workout.id = uuid.v4();
    workout.votes = {likes: 0, dislikes: 0};
    workouts.push(workout);
    res.json(workout);
});

app.post('/workouts/:id/vote', (req, res) => {
    const id = req.params.id;
    const vote = req.body.like;
    const userId = req.body.userId;

    if (votes[id] && votes[id][userId]) {
        res.status(400).json({ message: 'Already voted' });
    } else {
        if (!votes[id]) votes[id] = {};
        votes[id][userId] = true;
        const workout = workouts.find(w => w.id === id);
        if (vote) {
            workout.votes.likes++;
        } else {
            workout.votes.dislikes++;
        }
        res.json(workout.votes);
    }
});

  
  // Return the application's default page if the path is unknown
  app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });