const {WebSocketServer} = require('ws');
const ws = require('ws')



function peerProxy(httpServer) {
  // Create a websocket object
  const wss = new WebSocketServer({ noServer: true });

  // Handle the protocol upgrade from HTTP to WebSocket
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
  });
  wss.on('connection', socket => {
    socket.on('message', message =>{
      console.log(message)
      socket.send(`${message}`);


    })
  })

}

module.exports = { peerProxy };