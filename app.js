// Dependencies
const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const mongoose = require('./database/database');
const routes = require('./routes/routes');

// Web Server config

const app = express();

app.set('port', (process.env.PORT || 3000))

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(session({
  store: mongoStore.create({
    mongoUrl: process.env.mongo_url,
    autoRemove: 'native'
  }),
	secret: 'secret',
	resave: true,
	saveUninitialized: false,
  //secure: true /* use with HTTPS */
}));

// Routes
app.use('/', routes);

// Listen for connections
app.listen(app.get('port'), ()=>{
    console.log(`[Express] Server listening on port ${app.get('port')}!`);
})





