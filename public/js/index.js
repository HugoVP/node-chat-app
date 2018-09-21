const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

const messagesList = $('#messages');

socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = $('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  messagesList.append(li);
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  
  const li = $('<li></li>');
  li.text(`${message.from} ${formattedTime}: `);
  
  const a = $('<a></a>');
  a.attr('target', '_blank');
  a.attr('href', message.url);
  a.text('My current location');
  
  li.append(a);
  messagesList.append(li);
});

const messageTextbox = $('[name=message]');

$('#message-form').on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val(),
  }, function () {
    messageTextbox.val('');
  });
});

const locationButton = $('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton
    .attr('disabled', 'disabled')
    .text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton
      .removeAttr('disabled')
      .text('Send Location');

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function () {
    locationButton
      .removeAttr('disabled')
      .text('Send Location');
    
      alert('Unable to fetch location');
  });
});