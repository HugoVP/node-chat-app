const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const { generateMessage } = require('./utils/message');

const app = express();
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New user connected');
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Node Chat App'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', ({ from, text }, callback) => {
    console.log('createMessage: ', {from, text});    
    io.emit('newMessage', generateMessage(from, text));
    callback('This is from the Server');
  });
  
  socket.on('disconnect', () => {
    console.log('User was disconnected');  
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});