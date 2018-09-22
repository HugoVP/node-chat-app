const socket = io();

/* Form elements */
const messagesList = $('#messages');
const messageForm = $('#message-form');
const messageTextbox = $('[name=message]');
const locationButton = $('#send-location');

/* Message templates */
const messageTemplate = $('#message-template').html();
const locationMessageTemplate = $('#location-message-template').html();

/* Socket events */
socket.on('connect', function () {
  const params = $.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
      return;
    }

    console.log('No error');    
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUsersList', function (users) {
  const ol = $('<ol></ol>');
  
  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  
  const html = Mustache.render(messageTemplate, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });

  messagesList.append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  
  const html = Mustache.render(locationMessageTemplate, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });

  messagesList.append(html);
  scrollToBottom();
});


/* Form events */
messageForm.on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    text: messageTextbox.val(),
  }, function () {
    messageTextbox.val('');
  });
});

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

/* Scrolling */
function scrollToBottom() {
  const clientHeight = messagesList.prop('clientHeight');
  const scrollTop = messagesList.prop('scrollTop');
  const scrollHeight = messagesList.prop('scrollHeight');
  const newMessage = messagesList.children('li:last-child');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messagesList.scrollTop(scrollHeight);
  }
}