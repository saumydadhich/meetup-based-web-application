var express = require('express');
var crypto = require('crypto');

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}


var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:value
  };
};

module.exports.verifyPassword = function(userPassword, salt, hash){
  var userHash = sha512(userPassword, salt);
  if (userHash.passwordHash === hash) {
    return true;
  }
  else {
    return false;
  }
}

module.exports.generatePasswordHashAndSalt = function(userPassword){
  var salt = genRandomString(16);
  var passData = sha512(userPassword, salt);
  return passData
}


module.exports.sha512 = sha512;
module.exports.genRandomString = genRandomString;
