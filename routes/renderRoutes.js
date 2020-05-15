var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var userDB = require('../database/userDB.js');
var userProfile = require('../models/userProfile.js');

const {check, validationResult, sanitizeBody} = require('express-validator');

//route to the connections page
router.get('/connections', async function(req, res){
  if (!req.session.loginStatus)
    var status = 0;
  else {
    var status = 1;
  }
    var records = require('./../database/connectionDB.js');
    records = await records.getConnections();
    var genres = require('./../database/connectionDB.js');
    genres = await genres.getGenres();
    res.render('connections', {records: records, genres: genres, loginName: req.session.loginName, status: status});
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
router.get('/connection', async function(req, res){
   if (!req.session.loginStatus)
     var status = 0;
   else{
     var status = 1;
  }
    var connectionID = require('./../database/connectionDB.js');
    if (isNaN(req.query.connectionID)) {
      connectionID = undefined;
    }
    else {
      connectionID = await connectionID.getConnection(req.query.connectionID);
    }
    if ((req.query.connectionID && connectionID != undefined) || connectionID) {
      var hide = 0
      if(req.session.loginStatus){
        if(connectionID.userID === req.session.loginName.userID){
          hide = 1
        }
        var loginName = req.session.loginName
      }
      else {
        hide = 1
        var loginName = ""
      }
      res.render('connection', {connectionID: connectionID, status: status, loginName: loginName, hide: hide});
    }
    else {
      res.redirect('/connections')
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
    res.render('newConnection', {status: status, loginName: req.session.loginName, failure: 'none', errorMessage: "", action: "create"});
  }
});

//route to add a new connection
router.post('/newConnection/addConnection', urlencodedParser,
check('topic').custom(value => {
  var isValid = value.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
  if(isValid != null)
    return true;
  else {
    return false;
  }
}).withMessage('Topic should contain only characters and spaces'),
check('name').custom(value => {
  var isValid = value.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
  if(isValid != null)
    return true;
  else {
    return false;
  }
}).withMessage('Name should contain only characters and spaces'),
check('details').isLength({min: 40}).withMessage('Details has to be more than 40 characters'),
check('where').custom(value => {
  var isValid = value.match(/^[a-zA-Z0-9,.# ]*$/);
  if(isValid != null)
    return true;
  else {
    return false;
  }
}).withMessage('location can only contain alphanumeric characters, spaces and punctuation'),
async function(req, res){
  if (!req.session.loginStatus)
    res.redirect('/login')
  else {
    const errors = validationResult(req);
    var connectionDetails = require('./../database/connectionDB.js');
    if(req.body.update){
      var id = req.body.concertID
    }
    else {
      var id = 0
    }
    if (!errors.isEmpty()) {
      res.render('newConnection', {status: 1, loginName: req.session.loginName, failure: "true", errorMessage: errors.array(), action: "create"})
    }
    else if(id === 0 && await connectionDetails.isConnectionDuplicate(req.body.where, req.body.date, req.body.time, "create", id) != 0){
      res.render('newConnection', {status: 1, loginName: req.session.loginName, failure: "true", errorMessage: [{msg: "A concert is already happening at the same location at the same time. Please select a different time or location."}], action: "create"})
    }
    else if(id != 0 && await connectionDetails.isConnectionDuplicate(req.body.where, req.body.date, req.body.time, "update", id) != 0){
      console.log(req.body.concertID);
      var connectionDetails = require('./../database/connectionDB.js');
      var concertInfo = await connectionDetails.getConnection(req.body.concertID);
      res.render('newConnection', {status: 1, loginName: req.session.loginName, failure: "true", errorMessage: [{msg: "A concert is already happening at the same location at the same time. Please select a different time or location."}], action: "edit", concertInfo: concertInfo})
    }
    else {
      //var concertModel = require('./../models/concerts.js');
      var concertModel = require('./../models/concerts.js');
      if(id === 0)
        var uniqueID = await connectionDetails.generateUniqueConcertID();
      else
        var uniqueID = id;
      var hostName = ""
      if(req.body.organizer === ""){

        hostName = hostName.concat(req.session.loginName.FirstName, " ",  req.session.loginName.LastName);
      }
      else{
        hostName = req.body.organizer
      }
      var concertModel = concertModel.concerts(uniqueID, req.session.loginName.userID, req.body.name, req.body.topic, req.body.details, req.body.date.toString(), req.body.time, req.body.where, hostName, req.session.loginName.Image)
      await connectionDetails.addNewConnection(concertModel);
      if(id != 0){
        var loginProfile = new userProfile(req.session.loginName.userID);
        await loginProfile.updateConnection(concertModel);
      }
      res.redirect('/myProfile')
    }
  }
});

//route to the saved connections page
router.get('/savedConnections', async function(req, res){
  if(!req.session.loginStatus){
    res.redirect('/');
  }
  else{
    var status = 1;
    loginProfile = new userProfile(req.session.loginName.userID);
    var output = await loginProfile.getConnections()
    res.render('savedConnections', {loginName: req.session.loginName, output: output, status: status});
  }
});


//Handling the POST request to update a user created connection
router.post('/updateMyConnection', urlencodedParser, async function(req, res){
  if(!req.session.loginStatus){
    res.redirect('/');
  }
  else {
    loginProfile = new userProfile(req.session.loginName.userID);
    var connectionDetails = require('./../database/connectionDB.js');
    var concertInfo = await connectionDetails.getConnection(req.body.concertID);
    console.log(concertInfo);
    res.render('newConnection', {status: 1, loginName: req.session.loginName, failure: "false", errorMessage: "", action: "view", concertInfo: concertInfo})
  }
});

//GET request to edit a created connection
router.get('/editCreatedConnection', async function(req, res){
  if (!req.session.loginStatus)
    res.redirect('/');
  else{
    var status = 1;
    var connectionID = require('./../database/connectionDB.js');
    if (isNaN(req.query.connectionID)) {
      connectionID = undefined;
    }
    else {
      connectionID = await connectionID.getConnection(req.query.connectionID);
    }
    if ((req.query.connectionID && connectionID != undefined) || connectionID) {
      var hide = 0
      if(connectionID.userID === req.session.loginName.userID){
        hide = 1
      }
      var connectionDetails = require('./../database/connectionDB.js');
      var concertInfo = await connectionDetails.getConnection(req.query.connectionID);
      res.render('newConnection', {status: 1, loginName: req.session.loginName, failure: "false", errorMessage: "", action: "edit", concertInfo: concertInfo})
    }
    else {
      res.redirect('/myProfile')
    }
  }
});


//Handling the POST request to delete a user created connection entirely from the database
router.post('/deleteCreatedConnections', urlencodedParser, async function(req, res) {
  if(!req.session.loginStatus){
    res.redirect('/');
  }
  else {
    var userConnection = require('./../database/userDB.js')
    var connectionDetails = require('./../database/connectionDB.js');
    await connectionDetails.deleteConnection(req.body.concertID);
    await userConnection.deleteCreatedConnection(req.body.concertID);
    res.redirect('/myProfile')
  }
});

module.exports = router;
