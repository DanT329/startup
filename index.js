const express = require('express');
const app = express();
var UsersData = [];
var MessagesData = [];
var UserMessages = [];

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
    UsersData.push(req.body);
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
    UserMessages.push({ sender, receiver, link });
    res.status(201).send(req.body);
});


// GetUserMessages
apiRouter.get('/UserMessages', (req, res) => {
    var sender = req.query.sender;

    // Get the links for the sender
    var links = UserMessages.filter(userMessage => userMessage.sender === sender).map(userMessage => userMessage.link);
    console.log('Links:', links); // Log the links
    res.send(links);
});


  
  // Return the application's default page if the path is unknown
  app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });