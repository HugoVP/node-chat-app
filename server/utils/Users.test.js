const expect = require('expect');

const Users = require('./Users');

describe('Users', () => {
  beforeEach(() => {
    Users.items = [
      {
        id: '1',
        name: 'User One',
        room: '1 - A',
      },
      {
        id: '2',
        name: 'User Two',
        room: '1 - B',
      },
      {
        id: '3',
        name: 'User Three',
        room: '1 - A',
      },
    ];
  });

  it('should add new user', () => {    
    const user = {
      id: 'abc123',
      name: 'Test User',
      room: 'Test Room',
    };
    
    Users.items = [];
    Users.addUser(user.id, user.name, user.room);
    expect(Users.items).toEqual([user]);
  });

  it('should remove a user', () => {
    const { id } = Users.items[0];
    const user = Users.removeUser(id);
    expect(user).toExist();
    expect(Users.items.length).toBe(2);
  });

  it('should not remove a user', () => {
    const id = 'fakeId';
    const user = Users.removeUser(id);
    expect(user).toNotExist();
    expect(Users.items.length).toBe(3);
  });

  it('should find user', () => {
    const { id } = Users.items[0];
    const user = Users.getUser(id);
    expect(user.id).toBe(id);
  });

  it('should not find user', () => {
    const id = 'fakeId';
    const user = Users.getUser(id);
    expect(user).toNotExist();
  });

  it('should return user names for room 1 - A', () => {
    const usersList = Users.getUsersList('1 - A');
    expect(usersList).toEqual(['User One', 'User Three']);
  });

  it('should return user names for room 1 - B', () => {
    const usersList = Users.getUsersList('1 - B');
    expect(usersList).toEqual(['User Two']);
  });
});