var user = require('./../models/user.js');
var userConnection = require('./../models/userConnection.js');

//hardcoded user Database
var userDB = [
  {
    userDetails: user.user("user101", "Saumy", "Dadhich", "sdadhich@uncc.edu", "ABC Street", "Apt A", "Charlotte", "NC", "28262", "USA"),
    userConnection: [userConnection.userConnection("1001", "Blink 182", "Spectrum Center", "Yes"), userConnection.userConnection("1003", "Pink Floyd", "Spectrum Center", "Maybe")]
  },
  {
    userDetails: user.user("user102", "Demo", "User", "demo@uncc.edu", "ABC Street", "Apt B", "Charlotte", "NC", "28262", "USA"),
    userConnection: [userConnection.userConnection("1002", "Radiohead", "PNC Music Pavilion", "Yes"), userConnection.userConnection("1005", "50 Cent", "The Fillmore", "No")]
  }
]

//function to reset the database whenever a user signs in
module.exports.initialiseHardcodedDB = function(){
  userDB = [
    {
      userDetails: user.user("user101", "Saumy", "Dadhich", "sdadhich@uncc.edu", "ABC Street", "Apt A", "Charlotte", "NC", "28262", "USA"),
      userConnection: [userConnection.userConnection("1001", "Blink 182", "Spectrum Center", "Yes"), userConnection.userConnection("1003", "Pink Floyd", "Spectrum Center", "Maybe")]
    },
    {
      userDetails: user.user("user102", "Demo", "User", "demo@uncc.edu", "ABC Street", "Apt B", "Charlotte", "NC", "28262", "USA"),
      userConnection: [userConnection.userConnection("1002", "Radiohead", "PNC Music Pavilion", "Yes"), userConnection.userConnection("1005", "50 Cent", "The Fillmore", "No")]
    }
  ]
};

//function to return the connection details of the entered user ID
var getUserConnections = function(userID) {
  for (var i = 0; i < userDB.length; i++) {
    if (userDB[i].userDetails.userID === userID)
      return userDB[i].userConnection;
  }
};

//function to add or update the connection details of the entered user ID
var updateUserConnection = function(userID, userConnectionDetails) {
  for (var i = 0; i < userDB.length; i++) {
    if (userDB[i].userDetails.userID === userID) {
      userDB[i].userConnection = userConnectionDetails;
    }
  }
}

//function to return the list of all the users in the database
module.exports.getUsers = function() {
  return userDB.map(a => a.userDetails);
}

module.exports.getUserConnections = getUserConnections;
module.exports.updateUserConnection = updateUserConnection;
