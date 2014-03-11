'use strict';

module.exports = User;

function User(user){
  this.role = user.role;
  this.email = user.email;
  this.password = user.password;
}
