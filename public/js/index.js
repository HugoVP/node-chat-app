const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

const messagesList = $('#messages');
const messageTemplate = $('#message-template').html();

socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  
  const html = Mustache.render(messageTemplate, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });

  messagesList.append(html);
});

const locationMessageTemplate = $('#location-message-template').html();

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  
  const html = Mustache.render(locationMessageTemplate, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });

  messagesList.append(html);
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