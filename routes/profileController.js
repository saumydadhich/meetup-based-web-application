var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var userDB = require('../database/userDB.js');
var userProfile = require('../models/userProfile.js');

//route to login and create a session with user's profile contents
router.get('/login', function(req, res){
  userDB.initialiseHardcodedDB();
  if(!req.session.loginStatus){
    req.session.loginStatus = 1;
    var userList = userDB.getUsers();
    req.session.loginName = userList[Math.floor((Math.random() * userList.length))];
  }
  loginProfile = new userProfile(req.session.loginName.userID);
  var output = loginProfile.getConnections()
  res.redirect('/savedConnections');
});

//logout route and clearing out all the content from the session
router.get('/logout', function(req, res){
  req.session.destroy(function(err) {
    if(err) {
      res.negotiate(err);
    }
    res.redirect('/');
  });
});

//function to handle post requests - save user's rsvp and update rsvp for a connection
router.post('/savedConnections',urlencodedParser, function(req, res){
  loginProfile = new userProfile(req.session.loginName.userID);
  if (req.body.delete) {
    loginProfile.removeConnection(req.body.concertID);
  }
  else {
    loginProfile.addConnection(req.body.concertID, req.body.rsvp);
  }
  var output = loginProfile.getConnections()
  res.render('savedConnections', {loginName: req.session.loginName, output: output, status: 1});
})

module.exports = router;
