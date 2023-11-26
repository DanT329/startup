const io = require('socket.io');

const ADMIN = "Admin"

// state
const UsersState = {
  users: [],
  setUsers: function(newUsersArray){
    this.users = newUsersArray
  }
}

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


function buildMsg(name, text){
  return {
    name,
    text,
    time: new Intl.DateTimeFormat('default',{
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'

    }).format(new Date())
  }
}

// User Functions

function activateUser(id, name, room){
  const user = {id, name, room}
  UsersState.setUsers([
    ...UsersState.users.filter(user => user.id !== id),
    user
  ])
  return user
}

function userLeavesApp(id){
  UsersState.setUsers(
    UsersState.users.filter(user => user.id !==id)
  )
}

function getUser(id){
  return UsersState.users.find(user => user.id === id)
}

function getUsersInRoom(room){
  return UsersState.users.filter(user => user.room === room)
}

module.exports = { peerProxy };
