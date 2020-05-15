//userConnection model
var userConnection = function(userID, connectionID, connectionName, location, rsvp){
  var userConnectionModel = {userID: userID, connectionID: connectionID, connectionName: connectionName, location: location, rsvp: rsvp};
  return userConnectionModel;
}

module.exports.userConnection = userConnection;
