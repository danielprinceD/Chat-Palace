class User {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    let present = { id, name, room };
    this.users.push(present);
    return present;
  }
  get_list(room) {
    let users = this.users.filter((u) => u.room === room);
    name_list = users.map((u) => u.name);
    return name_list;
  }
  getUser(id) {
    return this.users.filter((u) => u.id === id)[0];
  }
  removeUser(id) {
    let user = this.getUser(id);
    if (user) this.users = this.users.filter((u) => u.id !== id);
    return user;
  }
}

module.exports = User;
