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
    console.log(buildMsg(ADMIN, "Welcome to Chat!"));
    socket.emit('message', buildMsg(ADMIN, "Welcome to Chat!"))
    

    socket.on('enterRoom',({name,room}) =>{
      //leave rooms
      const prevRoom = getUser(socket.id)?.room

      if(prevRoom){
        socket.leave(prevRoom)
        server.to(prevRoom).emit('message',buildMsg(ADMIN, `${name} has left the room`))
      }

      const user = activateUser(socket.id, name, room)

      // Can't update previous room users list until state update

      if(prevRoom){
        server.to(prevRoom).emit('userList',{
          users: getUsersInRoom(prevRoom)
        })
      }

      // join  room

      socket.join(user.room)

      // To user who joined
      socket.emit('message', buildMsg(ADMIN, `You have joined the ${user.room} chat room`))

      // To everyone else
      socket.broadcast.to(user.room).emit('message',buildMsg(ADMIN, `${user.name} has joined the room`))


      // Update user list for room

      server.to(user.room).emit('userList', {
        users: getUsersInRoom(user.room)
      })

      // Update rooms list for all

      server.emit('roomList', {
        rooms: getAllActiveRooms()
      })
    })

    socket.on('disconnect',() => {
      const user = getUser(socket.id)
      userLeavesApp(socket.id)

      if(user){
        server.to(user.room).emit('message', buildMsg(ADMIN,`${user.name} has left the room`))
      
        server.to(user.room).emit('userList',{
          users: getUsersInRoom(user.room)

        })

        server.emit('roomList',{
          rooms:  getAllActiveRooms()
        })
      }

      console.log(`User ${socket.id} disconnected`)
    })
    
    socket.on('message', ({name, text}) => {
      const room = getUser(socket.id)
      if(room){
        server.to(room).emit('message', buildMsg(name,  text))
      }
    })
  
  })
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

function getAllActiveRooms(){
  return Array.from(new Set(UsersState.users.map(user => user.room)))
}

module.exports = { peerProxy };
