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
    from: 'test@test.test',
    text: 'From backend',
    createdAt: new Date(),
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage: ', message);
    
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime(),
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User was disconnected');  
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});