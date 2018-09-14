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

socket.on('newLocationMessage', function ({ from, url }) {
  console.log('newLocationMessage: ', from, url);
  
  const li = $('<li></li>');
  li.text(`${from}: `);
  
  const a = $('<a></a>');
  a.attr('target', '_blank');
  a.attr('href', url);
  a.text('My current location');
  
  li.append(a);
  $('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'Fronend',
//   text: 'From frontend',
// }, function (data) {
//   console.log('Got it: ', data);  
// });

$('#message-form').on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name=message]').val(),
  }, function () {

  });
});

const locationButton = $('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function () {
    alert('Unable to fetch location');
  });
});