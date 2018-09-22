const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/message');

const {
  isRealString,
} = require('./utils/validation');

const Users = require('./utils/Users');

const app = express();
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', ({ name, room }, callback) => {
    if (!isRealString(name) || !isRealString(room)) {
      callback('Name and room name are required');
    }

    socket.join(room);
    Users.removeUser(socket.id);
    Users.addUser(socket.id, name, room);

    io.to(room).emit('updateUsersList', Users.getUsersList(room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Node Chat App'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined`));
    callback();
  });

  socket.on('createMessage', ({ text }, callback) => {
    const user = Users.getUser(socket.id);

    if (user && isRealString(text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, text));
    }
    
    callback();
  });

  socket.on('createLocationMessage', ({ latitude, longitude }) => {
    const user = Users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, latitude, longitude));
    }    
  });

  socket.on('disconnect', () => {
    const user = Users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUsersList', Users.getUsersList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});