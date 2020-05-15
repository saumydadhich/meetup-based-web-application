var userDB = require('./../database/userDB.js');
var userConnectionModel = require('./../models/userConnection.js');
var connectionDetails = require('./../database/connectionDB.js');

var userConnection = ""

class userProfile {
  //constructor to initialize the instance with user ID and their connection details
  constructor(userID) {
    this.userID = userID;
    //userConnection = userDB.getUserConnections(userID);
  }

  //function to add or update an existing connection for a user
  async addConnection(connection, rsvp) {
    var detailsToAdd = await connectionDetails.getConnection(connection);
    //userConnection.push(userConnectionModel.userConnection(this.userID, connection, detailsToAdd.connectionName, detailsToAdd.location, rsvp));
    var para = userConnectionModel.userConnection(this.userID, connection, detailsToAdd.connectionName, detailsToAdd.location, rsvp)
    await userDB.updateUserConnection(this.userID, para);
  }

  //function to remove a user's saved connection
  async removeConnection(connection) {
    await userDB.deleteUserConnection(this.userID, connection);
  }

  async updateConnection(userConnectionData) {
    await userDB.updateConnectionValue(userConnectionData);
  }

  //function to fetch saved connection details
  async getConnections() {
    userConnection = await userDB.getUserConnections(this.userID);
    return userConnection;
  }

  async createdConnections(){
    return await connectionDetails.getCreatedConnections(this.userID);
  }

  emptyProfile() {

  }

}

module.exports = userProfile;
