// Router
const router = require('express').Router();
// Helpers
const checkLogin = require('../helpers/checkLogin');
const isActivated = require('../helpers/isActivated');
// Request Handlers
const login = require('./login');
const register = require('./register');
const resetPass = require('./resetPass');
const authorize = require('./authorize');

// Default page
router.get('/', checkLogin, (req, res)=>{
    res.sendFile('/html/content.html', {root: __dirname + '/..'});
})

// User's content page
router.get('/content', checkLogin, (req, res)=>{
    res.sendFile('/html/content.html', {root: __dirname + '/..'});
});

// Get account details
router.get('/accountDetails', [checkLogin, isActivated], (req, res)=>{
    res.json(req.session.account);
});

// login page
router.get('/login', (req, res)=>{
    res.sendFile('/html/login.html', {root: __dirname + '/..'});
});

// Clear session data
router.get('/logout', checkLogin, (req, res)=>{
    req.session.destroy();
    res.sendFile('/html/login.html', {root: __dirname + '/..'});
});

// Login form handler
router.post('/login', login);

// Register form handler
router.post('/register', register);

// Send password reset link
router.post('/resetPass', resetPass);

// Handle authorize url
router.get('/authorize', authorize);

// Any other url
router.all('*', (req, res)=>{
    res.send('Page not found!');
})

module.exports = router;