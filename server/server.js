const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the Node Chat App!',
    createdAt: new Date().getTime(),
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime(),
  });

  socket.on('createMessage', ({ from, text }) => {
    console.log('createMessage: ', {from, text});
    
    io.emit('newMessage', {
      from,
      text,
      createdAt: new Date().getTime(),
    });
    
    // socket.broadcast.emit('newMessage', {
    //   from,
    //   text,
    //   createdAt: new Date().getTime(),
    // });
  });
  
  socket.on('disconnect', () => {
    console.log('User was disconnected');  
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});