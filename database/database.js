const mongoose = require('mongoose');

// Url for database connection
let url = process.env.mongoUrl; // env variable for default

if(!url) url = 'mongodb://127.0.0.1/accounts'; // if env var is not set, connect to the default local url

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

// Display information about connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, '[Mongoose] Database connection error:'));
db.once('open', function() { console.log('[Mongoose] Database connected!') });
