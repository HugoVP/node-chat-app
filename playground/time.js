const moment = require('moment');

const createdAt = 1234;
const date = moment(createdAt);
console.log(date.format('h:mm a'));

const someTimestamp = moment().valueOf();
console.log(someTimestamp);