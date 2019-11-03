//userConnection model
var userConnection = function(connectionID, connectionName, location, rsvp){
  var userConnectionModel = {connectionID: connectionID, connectionName: connectionName, location: location, rsvp: rsvp};
  return userConnectionModel;
}

module.exports.userConnection = userConnection;
