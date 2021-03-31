const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Account = require('./accountSchema');
const mongoDB = require('./database');
const mailer = require('./mailer');

const thirtyMinutes = 1800000;

/* WEB SERVER CONFIG */

const app = express();

app.set('port', (process.env.PORT || 3000))

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


/* ROUTES */

// main page, if logged in show user's content
app.get('/', checkLogin, (req, res)=>{
    res.sendFile(__dirname+'/content.html');
})

// login page
app.get('/login', (req, res)=>{
    res.sendFile(__dirname+'/login.html');
})

// Clear session data
app.get('/logout', (req, res)=>{
  req.session.logged = false;
  req.session.user = '';
  req.session.account = {};
  res.sendFile(__dirname+'/login.html');
})

// user's content page
app.get('/content', checkLogin, (req, res)=>{
    res.sendFile(__dirname+'/content.html');
})

// get account details
app.get('/accountDetails', [checkLogin, isActivated], (req, res)=>{
    res.json(req.session.account);   
})

// login form handler
app.post('/login', (req, res)=>{

    Account.findOne({email: req.body.email}, async(error, account)=>{

        if(error || !account) return res.redirect('?invalid'); // there's no such account or error was thrown while searching database

        // check if the found account has the same password as entered by user
        if(account && (await bcrypt.compare(req.body.pass, account.pass))==false) return res.redirect('?invalid');
        
        // passwords are matching, flag session as logged and redirect to user's content
        req.session.logged = true;
        req.session.user = req.body.email;
        res.redirect('/content');
    })
})

// register form handler
app.post('/register', (req, res)=>{

  Account.findOne({email: req.body.email}, async(error, account)=>{ // check if the mail is already in database
      if(error) return res.send('error');
      if(account) return res.send('exists');

      // create new account
      const newAccount = new Account({
        email: req.body.email,
        pass: (await bcrypt.hash(req.body.pass, 10)),
        token: (await generateToken()), tokenExpires: Date.now() + thirtyMinutes, activated: false
      });

      // save the account to database and send activation link via mail
      newAccount.save(()=>{

        mailer.sendActivationMail(req.body.email, req.headers.host + '/authorize?action=activate&token=' + newAccount.token);
        res.send('created');
      })
  })
})

// send password reset link
app.post('/resetPass', (req, res)=>{
    Account.findOne({email: req.body.email}, async(error, account)=>{
        if(account){ // can't assign authorize token to non-existing account
          // generate password reset authorize token, then save it to database and send it via mail
          account.token = await generateToken();
          account.tokenExpires = Date.now() + thirtyMinutes;
          account.save();
          mailer.sendResetMail(req.body.email, req.headers.host + '/authorize?action=reset&token=' + account.token);
        }
    })
    res.sendStatus(200); // send OK anyway
})

// handle authorize url
app.get('/authorize', (req, res)=>{
    Account.findOne({token: req.query.token}, (error, account)=>{
        if(account && account.tokenExpires>Date.now()){ // check if token is valid

          if(req.query.action == 'activate'){ // activate account
            account.activated = true;
            res.send('Account activated!');
          }else if(req.query.action == 'reset'){ // reset password
            res.send('You will be able to set your new password here in the future!');
          }

          account.token = ''; // reset token after authorizing
          account.save(); // save to database
          
        }else res.send('The link has expired or there is no such account!');
    })
})

// listen for connections
app.listen(app.get('port'), ()=>{
    console.log(`[Express] Server listening on port ${app.get('port')}!`);
})


/* HELPERS */
function checkLogin(req, res, next){
    if(req.session.logged){ // if user is logged proceed to the requested page
      return next();
    }else { // otherwise force user to log in
      return res.redirect('/login');
    }
}

// check if user activated his account
function isActivated(req, res, next){
  Account.findOne({email: req.session.user}, (error, account)=>{
    if(error || !account) return res.sendStatus(404); // there's no such account or error occured
    if(!account.activated) return res.sendStatus(403); // account not activated, block further access!

    req.session.account = account; // save account object to session variable
    next(); // passed, go to next middleware
  })  
}

// generate a token for athorizing various actions via email
async function generateToken(){
    let account = true;

    while(account){ // generate new token as long as it's not unique

      var token = (await crypto.randomBytes(30)).toString('hex');
      account = await Account.findOne({token: token});
    }
    return token;
}

