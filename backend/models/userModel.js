const { ObjectId } = require('mongodb');


class User {
  constructor(userName, email, password, isAdmin = false) {
    this._id = new ObjectId();
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
    this.createdAt = new Date();
  }
}

class UserLogin {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

module.exports = {
  User,
  UserLogin,
};