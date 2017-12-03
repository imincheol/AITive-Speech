// Get express module 
var express = require('express');

// Middleware - body-parser 
var bodyParser = require('body-parser');

// Create express server instance 
var app = express();


// Template engine 
app.set('views', './views');
app.set('view engine', 'ejs');



// Middleware - static server 
app.use(express.static(__dirname + '/public'));
// Middleware - body parser
app.use(bodyParser.urlencoded({extended: false}));



// Router
app.use('/', require('./routes/index.js'));
app.use('/tts', require('./routes/tts.js'));



// Server
app.listen(80, function () {
    console.log('Server is started!');
});