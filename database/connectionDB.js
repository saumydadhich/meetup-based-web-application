var concertModel = require('./../models/concerts.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/concertHub');

var db = mongoose.connection;
var concertDBSchema = new mongoose.Schema({
  connectionID: {type: Number, required: true},
  userID: String,
  connectionName: {type: String, required: true},
  connectionTopic: {type: String, required: true},
  details: String,
  date: {type: String, required: true},
  time: {type: String, required: true},
  location: {type: String, required: true},
  hostName: {type: String, required: true},
  image: {type: String, required: true}
}, {collection: 'concertDB'});

var concertDB = mongoose.model("concertDB", concertDBSchema);
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  console.log('ConnectionDB connected');
});


//function to return all the entries in the DB
var getConnections = function() {
  return new Promise((resolve, reject) => {
    concertDB.find().then(docs => {
      resolve(docs);
    }).catch(err => {return reject(err);})
  })
};

//function to return the entry with a particular ID
var getConnection = function(connectionID) {
  return new Promise((resolve, reject) => {
    concertDB.findOne({connectionID: connectionID}).then(docs => {
      resolve(docs);
    }).catch(err => {return reject(err);})
  })
};

//function to return the list of genres in the DB
var getGenres = function(){
  return new Promise((resolve, reject) => {
    concertDB.distinct('connectionTopic').then(docs => {
      resolve(docs);
    }).catch(err=> {return reject(err);})
  })
}

//function to add a new connection
var addNewConnection = function(concertModel) {
  //var concertDoc = new concertDB(concertModel);
  //concertDoc.save();
  concertDB.findOneAndUpdate({connectionID: concertModel.connectionID}, concertModel, {upsert: true}, function(err, doc){
    if(err){console.log(err);}
  });
};

//function to delete a user created connection
module.exports.deleteConnection = function(connectionID){
  concertDB.deleteOne({connectionID: connectionID}, function(err){
    if(err){console.log(err);}
  });
}

//function to generate a unique concertID
module.exports.generateUniqueConcertID = function(){
  return new Promise((resolve, reject) => {
    concertDB.findOne({}, 'connectionID').sort('-connectionID').then(docs => {
      resolve(docs.connectionID + 1);
    }).catch(err => {return reject(err);})
  })
}

//function to return the list of connections created by the users
module.exports.getCreatedConnections = function(userID) {
  return new Promise((resolve, reject) => {
    concertDB.find({userID: userID}).then(docs => {
      resolve(docs);
    }).catch(err => {return reject(err);})
  })
}

//function to check if the new connection is not a duplicate
module.exports.isConnectionDuplicate = function(connectionLocation, connectionDate, connectionTime, action, connectionID){
  return new Promise((resolve, reject) => {
    if (action === "create") {
      concertDB.find({$and: [{location: connectionLocation}, {date: connectionDate}, {time: connectionTime}]}).then(docs => {
        resolve(docs.length);
      }).catch(err => {return reject(err);})
    }
    else if (action === "update") {
      concertDB.find({$and: [{location: connectionLocation}, {date: connectionDate}, {time: connectionTime}, {connectionID: {$ne: connectionID}}]}).then(docs => {
        resolve(docs.length);
      }).catch(err => {return reject(err);})
    }
  })
}

module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.getGenres = getGenres;
module.exports.addNewConnection = addNewConnection;
