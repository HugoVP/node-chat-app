class Users {
  static addUser(id, name, room) {
    const user = {id, name, room};
    this.items.push(user);
    return user;
  }

  static removeUser(id) {
    let targetUser;

    this.items = this.items.filter((user) => {
      if (user.id === id) {
        targetUser = user;
        return false;
      }
      
      return true;
    });

    return targetUser;
  }

  static getUser(id) {
    return this.items.filter(user => user.id === id).pop();
  }

  static getUsersList(room) {
    return this.items.filter(user => user.room === room)
            .map(user => user.name);
  }
}

Users.items = [];

module.exports = Users;
