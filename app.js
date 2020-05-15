var express = require("express");
var app = express();

var session = require('express-session');
app.use(session({secret: 'password'}));

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

var connections = require('./routes/renderRoutes.js');
var profileController = require('./routes/profileController.js');

app.use('/', connections);
app.use('/', profileController);

app.listen(8080);
