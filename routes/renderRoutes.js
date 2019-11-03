var express = require('express');
var router = express.Router();

var userDB = require('../database/userDB.js');
var userProfile = require('../models/userProfile.js');


//route to the connections page
router.get('/connections', function(req, res){
  if (!req.session.loginStatus)
    res.redirect('/')
  else {
    var status = 1;
    var records = require('./../database/connectionDB.js');
    records = records.getConnections();
    var genres = require('./../database/connectionDB.js');
    genres = genres.getGenres();
    res.render('connections', {records: records, genres: genres, loginName: req.session.loginName, status: status});
  }
});

//route to the about us page
router.get('/about', function(req, res){
  if (!req.session.loginStatus)
    var status = 0;
  else
    var status = 1;
  res.render('about', {status: status, loginName: req.session.loginName});
});

//route to the connection page
router.get('/connection', function(req, res){
  if (!req.session.loginStatus)
    res.redirect('/');
  else{
    var status = 1;
    var connectionID = require('./../database/connectionDB.js');
    connectionID = connectionID.getConnection(req.query.connectionID);
    if (req.query.connectionID && connectionID != undefined) {
      res.render('connection', {connectionID: connectionID, status: status, loginName: req.session.loginName});
    }
    else {
      res.redirect('/connections')
    }
  }
});

//route to the contact us page
router.get('/contact', function(req, res){
  if (!req.session.loginStatus)
    var status = 0;
  else
    var status = 1;
  res.render('contact', {status: status, loginName: req.session.loginName});
});

//route to the index page
router.get('/', function(req, res){
  if (!req.session.loginStatus)
    var status = 0;
  else
    var status = 1;
  res.render('index', {status: status, loginName: req.session.loginName});
});

//route to the new connection page
router.get('/newConnection', function(req, res){
  if (!req.session.loginStatus)
    res.redirect('/login')
  else{
    var status = 1;
    res.render('newConnection', {status: status, loginName: req.session.loginName});
  }
});

//route to the saved connections page
router.get('/savedConnections', function(req, res){
  if(!req.session.loginStatus){
    res.redirect('/');
  }
  else{
    var status = 1;
    loginProfile = new userProfile(req.session.loginName.userID);
    var output = loginProfile.getConnections()
    res.render('savedConnections', {loginName: req.session.loginName, output: output, status: status});
  }
});

module.exports = router;
