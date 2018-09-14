const expect = require('expect');

const {
  generateMessage,
  generateLocationMessage,
} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message objecct', () => {
    const from = 'Some name';
    const text = 'Some text';
    const message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Some name';
    const latitude = 123;
    const longitude = 321;
    const url = 'https://www.google.com/maps?q=123,321';
    const message = generateLocationMessage(from, latitude, longitude);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, url});
  });
});