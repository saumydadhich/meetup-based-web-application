var userDB = require('./../database/userDB.js');
var userConnectionModel = require('./../models/userConnection.js');
var connectionDetails = require('./../database/connectionDB.js');

var userConnection = ""

class userProfile {
  //constructor to initialize the instance with user ID and their connection details
  constructor(userID) {
    this.userID = userID;
    userConnection = userDB.getUserConnections(userID);
  }

  //function to add or update an existing connection for a user
  addConnection(connection, rsvp) {
    var flag = 0
    for (var i = 0; i < userConnection.length; i++) {
      if(userConnection[i].connectionID === connection){
        flag = 1;
        if(userConnection[i].rsvp != rsvp){
          userConnection[i].rsvp = rsvp;
          break;
        }
      }
    }
    if (flag === 0){
      var detailsToAdd = connectionDetails.getConnection(connection);
      userConnection.push(userConnectionModel.userConnection(connection, detailsToAdd.connectionName, detailsToAdd.location, rsvp));

    }
    userDB.updateUserConnection(this.userID, userConnection);
  }

  //function to remove a user's saved connection
  removeConnection(connection) {
    for (var i = 0; i < userConnection.length; i++) {
      if(userConnection[i].connectionID === connection){
        userConnection.splice(i, 1);
        break;
      }
    }
    userDB.updateUserConnection(this.userID, userConnection);
  }

  updateConnection(userConnectionData) {

  }

  //function to fetch saved connection details
  getConnections() {
    return userConnection;
  }

  emptyProfile() {

  }

}

module.exports = userProfile;
