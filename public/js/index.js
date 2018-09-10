const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('newMessage: ', message);
  $('#messages').append($(`<li>${message.from}: ${message.text}</li>`));
});

socket.emit('createMessage', {
  from: 'Fronend',
  text: 'From frontend',
}, function (data) {
  console.log('Got it: ', data);  
});

$('#message-form').on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val(),
  }, function () {

  });
});