var user = require('./../models/user.js');
var userConnection = require('./../models/userConnection.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/concertHub');

var passwordUtility = require('../passwordUtility.js');

var db = mongoose.connection;
var userDBSchema = new mongoose.Schema({
  userID: {type: String, required: true},
  password: {
    salt: {type: String, required: true},
    hash: {type: String, required: true}
  },
  FirstName: {type: String, required: true},
  LastName: {type: String, required: true},
  EmailAddress: {type: String, required: true},
  Address1: {type: String, required: true},
  Address2: String,
  City: {type: String, required: true},
  State: {type: String, required: true},
  ZipCode: {type: String, required: true},
  Country: {type: String, required: true},
  Image: String
}, {collection: 'userDB'});

var userConnectionDBSchema = new mongoose.Schema({
  userID: {type: String, required: true},
  connectionID: {type: Number, required: true},
  connectionName: {type: String, required: true},
  location: {type: String, required: true},
  rsvp: {type: String, required: true}
}, {collection: 'userConnectionDB'});

var userDB = mongoose.model("userDB", userDBSchema);
var userConnectionDB = mongoose.model("userConnectionDB", userConnectionDBSchema);
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  console.log('userDB and userConnectionDB connected');
});


//function to return the connection details of the entered user ID
var getUserConnections = function(userID) {
  return new Promise((resolve, reject) => {
    userConnectionDB.find({userID: userID}).then(docs => {
      resolve(docs);
    }).catch(err => {return reject(err);})
  })
};

//function to add or update the connection details of the entered user ID
var updateUserConnection = function(userID, userConnectionDetails) {
  userConnectionDB.findOneAndUpdate({userID: userID, connectionID: userConnectionDetails.connectionID},userConnectionDetails, {upsert: true}, function(err, doc){
    if(err){console.log(err)};
  });
}

//function to delete a user connection
module.exports.deleteUserConnection = function(userID, connectionID){
  userConnectionDB.deleteOne({connectionID: connectionID, userID: userID}, function(err){
    if(err){console.log(err)};
  })
}

//function to update connection values
module.exports.updateConnectionValue = function(concertModel){
  userConnectionDB.updateMany({connectionID: concertModel.connectionID}, {$set:{connectionName: concertModel.connectionName, location: concertModel.location}}, function(err){
    if(err){console.log(err);}
  })
}

//function to delete a user created connection by connecitonID
module.exports.deleteCreatedConnection = function(connectionID){
  userConnectionDB.deleteMany({connectionID: connectionID}, function(err){
    if(err){console.log(err)};
  })
}

//function to return the list of all the users in the database
module.exports.getUsers = function(username) {
  return new Promise((resolve, reject) => {
    userDB.findOne({EmailAddress: username}, {userID: 1, FirstName: 1, LastName: 1, EmailAddress: 1, Address1: 1, Address2: 1, City: 1, State: 1, State: 1, ZipCode: 1, Country: 1, Image: 1, _id: 0}).then(docs => {
      resolve(docs);
    }).catch(err => {return reject(err);})
  })
}

//function to search if the email id exists in the database
module.exports.isEmailPresent = function(username) {
  return new Promise((resolve, reject) => {
    userDB.findOne({EmailAddress: username}).then(docs => {
      //console.log(username);
      if (docs === null) {
        var bool = false
      }
      else {
        var bool = true
      }
      resolve(bool)
    }).catch(err => {return reject(err);})
    })
}

//function to validate the password
module.exports.validatePassword = function(username, userPassword) {
  return new Promise((resolve, reject) => {
    userDB.findOne({EmailAddress: username}, {password: 1, _id: 0}).then(docs => {
      var validPassword = passwordUtility.verifyPassword(userPassword, docs.password.salt, docs.password.hash);
      resolve(validPassword);
    }).catch(err => {return reject(err);})
  })
}

//function to generate password hash and salt
module.exports.generatePassword = function(password) {
  return passwordUtility.generatePasswordHashAndSalt(password);
}

//function to add a new user
module.exports.addUser = function(userData) {
  var document = new userDB(userData);
  document.save();
}

//function to get the user profile picture
module.exports.getProfilePic = function(userID) {
  return new Promise((resolve, reject) => {
    userDB.findOne({userID: userID}, {Image: 1, _id: 0}).then(docs => {
      resolve(docs.Image);
    }).catch(err => {return reject(err);})
  })
}

//function to generate a new userID
module.exports.getNewUserID = function() {
  return new Promise((resolve, reject) => {
    userDB.find().count().then(docs => {
      var num = 101 + docs
      resolve('user'.concat(num.toString()));
    }).catch(err => {return reject(err);})
  })
}

module.exports.getUserConnections = getUserConnections;
module.exports.updateUserConnection = updateUserConnection;
