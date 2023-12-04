const express = require('express');
const app = express();
const uuid = require('uuid');
const DB = require('./database.js');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { peerProxy } = require('./test_peerProxy.js');
var UsersData = [];
var MessagesData = [];
var UserMessages = [];
let conversations = {};

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);


// PostUsersData
apiRouter.post('/UsersData', (req, res) => {
    DB.addUser(req.body);
    //UsersData.push(req.body);
    res.status(201).send(req.body);
});

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if(await DB.getUser(req.body.name)){
    res.status(409).send({msg: 'User Name taken'});
  }else{
    const user = await DB.createUser(req.body);

    // Set the cookie
    setAuthCookie(res, user.token);
    res.status(201).send(req.body);
  }  
  
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.name);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.status(201).send(user.name); // Send a 201 status code with the user's name
    } else {
      res.status(401).send({ msg: 'Unauthorized' });
    }
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});


// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/display', async (req, res) => {
  const user = await DB.getUser(req.name);
  if (user) {
    const token = req?.cookies.token;
    res.send({authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    const user = await req.cookies[authCookieName];
    res.status(401).send({ msg: "Not Authorized" });
  }
});

// GetUsersData
secureApiRouter.get('/UsersData', async (_req, res) => {
  const user = await DB.getUserProfile();
  res.send(user);
  //res.send(UsersData);
});

// GetMessagesData
secureApiRouter.get('/Messages', (req, res) => {
    var sender = req.query.sender;
    var receiver = req.query.receiver;

    var conversation = MessagesData.filter(message => message.sender === sender && message.receiver === receiver);
    res.send(conversation);
});


// PostMessagesData
secureApiRouter.post('/Messages', (req, res) => {
    MessagesData.push(req.body);
    res.status(201).send(req.body);
});


// PostUserMessages
secureApiRouter.post('/UserMessages', (req, res) => {
    const { sender, receiver, link } = req.body;
    const existingMessage = UserMessages.find(message => message.sender === sender && message.receiver === receiver && message.link === link);
    if (!existingMessage) {
        UserMessages.push({ sender, receiver, link });
    }
    res.status(201).send(req.body);
});


secureApiRouter.get('/UserMessages', (req, res) => {
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
  secureApiRouter.get('/conversation', async (req, res) => {
    let user1 = req.query.user1;
    let user2 = req.query.user2;
    console.log('get conversation:')

    let  messages = await DB.getMessages(user1,user2); 
  
    // Get the message chain between the two users
    //let messages = getMessages(user1, user2);
  
    // Send the message chain as the response
    res.send(messages);
  });


function addMessage(sender, receiver, message) {
  // Create a unique key for the conversation
  DB.addMessage(sender,receiver,message);
  
  //let key = [sender, receiver].sort().join('-');

  // If the conversation doesn't exist, create it
  //if (!conversations[key]) {
    //  conversations[key] = [];
  //}

  // Append the message to the conversation
  //conversations[key].push({ sender: sender, message: message });
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
secureApiRouter.get('/uniqueConversations', async(req, res) => {
  let user = req.query.user;
  console.log('get unique conversations:')

  // Get the unique conversation partners for the user
  let uniqueConversations = await DB.getUniqueConversations(user);
  //let uniqueConversations = getUniqueConversations(user);

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


  // setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}
  

  const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

peerProxy(httpService);