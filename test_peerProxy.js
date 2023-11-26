const io = require('socket.io');

function peerProxy(httpServer) {
  // Create a Socket.IO server object
  const server = io(httpServer);

  // Handle a new connection
  server.on('connection', socket => {
    socket.on('message', message => {
      console.log(message);
      server.sockets.emit('message', message)
    });
  });
}

module.exports = { peerProxy };
