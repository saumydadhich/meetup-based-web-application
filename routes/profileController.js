var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const {check, validationResult, sanitizeBody} = require('express-validator');

var userDB = require('../database/userDB.js');
var userProfile = require('../models/userProfile.js');
//var passwordUtility = require('../passwordUtility.js');

//route to login and create a session with user's profile contents
router.get('/login', function(req, res){
  if(!req.session.loginStatus){
    res.render('login', {status: 0, failure: "none", errorMessage: ""})
  }
});

//POST request to validate login credentials
router.post('/login/validate', urlencodedParser, check('username').isEmail(),
check('password').not().isEmpty().isLength({min: 6}).withMessage('Password too short, should be atleast 6 characters')
.isLength({max: 15}).withMessage('Password cannot be more than 15 characters'), async function(req, res){
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.render('login', {status: 0, failure: "invalidPassword", errorMessage: errors.array()})
  }
  else {
    if(await userDB.isEmailPresent(req.body.username)){
      if(await userDB.validatePassword(req.body.username, req.body.password)){
        req.session.loginStatus = 1;
        req.session.loginName = await userDB.getUsers(req.body.username);
        res.redirect('/myProfile');
      }
      else {
        res.render('login', {status: 0, failure: "password", errorMessage: ""})
      }
    }
    else {
      console.log(req.body.username);
      res.render('login', {status: 0, failure: "email", errorMessage: ""})
    }
  }
});

//Route for the landing page after logging in
router.get('/myProfile', async function(req, res){
  if(!req.session.loginStatus){
    res.redirect('/');
  }
  else{
    loginProfile = new userProfile(req.session.loginName.userID);
    var output = await loginProfile.getConnections()
    var createdConnections = await loginProfile.createdConnections()
    var image = await userDB.getProfilePic(req.session.loginName.userID)
    res.render('landingPage', {loginName: req.session.loginName, output: output, status: 1, createdConnections: createdConnections, image: image})
  }
})

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
router.post('/savedConnections',urlencodedParser, async function(req, res){
  loginProfile = await new userProfile(req.session.loginName.userID);
  if (req.body.delete) {
    loginProfile.removeConnection(req.body.concertID);
  }
  else {
    await loginProfile.addConnection(req.body.concertID, req.body.rsvp);
  }
  var output = await loginProfile.getConnections()
  res.render('savedConnections', {loginName: req.session.loginName, output: output, status: 1});
})

//function to register a user
router.get('/signUp', function(req, res){
  res.render('signUp', {status: 0, failure: "none", errorMessage: ""});
})

//function to handle POST request of sign up
router.post('/signup/validate', urlencodedParser,
check('username').isEmail().custom(async value => {
  if(await userDB.isEmailPresent(value)){
    return Promise.reject();
  }
}).withMessage('Email invalid/already in use'),
check('password').isLength({min: 6}).withMessage('Password too short, should be atleast 6 characters')
.isLength({max: 15}).withMessage('Password cannot be more than 15 characters'),
check('confirmPassword').custom((value, {req}) => {
  if (value != req.body.password) {
    return false;
  }
  else {
    return true;
  }
}).withMessage('The passwords do not match'),
check('firstName').custom(value => {
  var isValid = value.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
  if(isValid != null)
    return true;
  else {
    return false;
  }
}).withMessage('First Name should contain only characters and spaces'),
check('lastName').isAlpha().withMessage('Last Name can only contain alphabets'),
check('address1').custom(value => {
  var isValid = value.match(/^[a-zA-Z0-9,.# ]*$/);
  if(isValid != null)
    return true;
  else {
    return false;
  }
}).withMessage('Address can only contain alphanumeric characters, spaces and punctuation'),
check('address2').custom(value => {
  var isValid = value.match(/^[a-zA-Z0-9,.# ]*$/);
  if(isValid != null)
    return true;
  else {
    return false;
  }
}).withMessage('Address can only contain alphanumeric characters, spaces and punctuation'),
check('city').isAlpha().withMessage('City can only contain alphabets'),
check('state').isAlpha().withMessage('State Name can only contain alphabets'),
check('country').custom(value => {
  var isValid = value.match(/^([a-zA-Z]+\s)*[a-zA-Z]+$/);
  if(isValid != null)
    return true;
  else {
    return false;
  }
}).withMessage('Country should contain only characters and spaces'),
check('zipcode').isNumeric().withMessage('Zipcode can only contain numbers'),
 async function(req, res) {
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
     console.log(errors.array());
     res.render('signup', {status: 0, failure: "email", errorMessage: errors.array()})
   }
   else {
     var userModel = require('./../models/user.js');
     var encryptedPassword = userDB.generatePassword(req.body.password)
     var userModel = userModel.user(await userDB.getNewUserID(), encryptedPassword, req.body.firstName, req.body.lastName, req.body.username, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zipcode, req.body.country, "blink.jpg");
     console.log(userModel);
     userDB.addUser(userModel);
     res.redirect('/')
   }
});

router.get('/*', function(req, res) {
    res.redirect('/');
});

module.exports = router;
