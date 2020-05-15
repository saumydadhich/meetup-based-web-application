//concert model
var concerts = function(connectionID, userID, connectionName, connectionTopic, details, date, time, location, hostName, image){
  var concertModel = {connectionID: connectionID, userID: userID, connectionName: connectionName, connectionTopic: connectionTopic, details: details, date: date, time: time, location: location, hostName: hostName, image: image};
  return concertModel;
}

module.exports.concerts = concerts;
