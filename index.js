const express = require('express');
const app = express();
const UsersData = [];

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
apiRouter.get('/Messages', (_req, res) => { // Add this block
    res.send(MessagesData);
});

// PostMessagesData
apiRouter.post('/Messages', (req, res) => { // Add this block
    MessagesData.push(req.body);
    res.status(201).send(req.body);
});

  
  // Return the application's default page if the path is unknown
  app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });
  
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });