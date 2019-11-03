//concert model
var concerts = function(connectionID, connectionName, connectionTopic, details, date, time, location, hostName, image){
  var concertModel = {connectionID: connectionID, connectionName: connectionName, connectionTopic: connectionTopic, details: details, date: date, time: time, location: location, hostName: hostName, image: image};
  return concertModel;
}

module.exports.concerts = concerts;
