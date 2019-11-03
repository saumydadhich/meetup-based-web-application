var concertModel = require('./../models/concerts.js');

//Creating a temporary database
var concertDB = [concertModel.concerts("1001", "Blink 182", "Rock", "Blink 182 are touring North America and celebrating the 20th Anniversary of their best selling albums, 'Enema of the State'. Two other artists - Lil Wayne and Neck Deep are also a part of this tour. Blink 182 will be playing their bestselling album in its entirety, along with other big hits. Below are the details about their tour.", "08/08/20", "7:00 PM", "Spectrum Center", "Epicenter Music Festival", "blink.jpg"),
concertModel.concerts("1002", "Radiohead", "Rock", "Radiohead is based out of England and is one of the biggest rock music artists out there. They will be headlining the Pitchford Music Festival in Chicago.", "08/08/20", "7:00 PM", "PNC Music Pavilion", "Pitchfork Music Festival", "pitchfork.jpg"),
concertModel.concerts("1003", "Pink Floyd", "Rock", "One of the all time greats will be performing in the Epicenter Music Festival. This is their first ever performance in the Carolinas.", "08/08/20", "7:00 PM", "Spectrum Center", "Epicenter Music Festival", "epicenter.jpg"),
concertModel.concerts("1004", "Eminem", "Hip Hop", "Eminem aka the real slim shady is also one of the features in this year's Epicenter Music Festival. He would be opening the festival in the most grandest of fashion.", "08/08/20", "7:00 PM", "PNC Music Pavilion", "Epicenter Music Festival", "epicenter.jpg"),
concertModel.concerts("1005", "50 Cent", "Hip Hop", "50 Cent is coming to Pitchfork Music Festival. Get ready for an incredible set of rap and hip hop featuring tracks like In Da Club, et cetera", "08/08/20", "7:00 PM", "The Fillmore", "Pitchfork Music Festival", "pitchfork.jpg"),
concertModel.concerts("1006", "Lil Wayne", "Hip Hop", "Lil Wayne is continuing his tours all across the states. After a tour with blink 182 and neck deep, Lil Wayne is the headline event of the Pitchfork Music Festival", "08/08/20", "7:00 PM", "The Fillmore", "Pitchfork Music Festival", "pitchfork.jpg"),
concertModel.concerts("1007", "Martin Garrix", "EDM", "Martin Garrix will be performing on multiple dates in the Ultra Music Festival, that too with different setlists for each day.", "08/08/20", "7:00 PM", "PNC Music Pavilion", "Ultra Music Festival", "ultra.jpg"),
concertModel.concerts("1008", "deadmau5", "EDM", "Get your dancing and hopping shoes on, coz deadmau5 is coming to town. Kicking off this year's incredible Ultra Music Festival, deadmau5 will be performing on the day 1.", "08/08/20", "7:00 PM", "Spectrum Center", "Ultra Music Festival", "ultra.jpg"),
concertModel.concerts("1009", "Tiesto", "EDM", "Tiesto will be the main event for the final day of the Ultra Music Festival. More information soon to be published. Stay tuned.", "08/08/20", "7:00 PM", "Woodstock", "Ultra Music Festival", "ultra.jpg")];

//function to return all the entries in the DB
var getConnections = function() {
  return concertDB;
}

//function to return the entry with a particular ID
var getConnection = function(connectionID) {
  for (var i = 0; i < concertDB.length; i++) {
    if(concertDB[i].connectionID === connectionID)
      return concertDB[i];
  }
};

//function to return the list of genres in the DB
var getGenres = function(){
  var genres = [], flags = [];
  for (var i = 0; i < concertDB.length; i++) {
    if (flags[concertDB[i].connectionTopic]) continue;
    flags[concertDB[i].connectionTopic] = true;
    genres.push(concertDB[i].connectionTopic);
  }
  return genres;
}

module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.getGenres = getGenres;
