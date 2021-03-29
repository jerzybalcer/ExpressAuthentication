const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Account = require('./accountSchema');
const mongoDB = require('./database');
const mailer = require('./mailer');

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

app.get('/', checkLogin, (req, res)=>{
    res.sendFile(__dirname+'/content.html');
})

app.get('/login', (req, res)=>{
    res.sendFile(__dirname+'/login.html');
})

app.get('/content', checkLogin, (req, res)=>{
    res.sendFile(__dirname+'/content.html');
})

app.post('/login', (req, res)=>{

    Account.findOne({email: req.body.email}, async(error, account)=>{

        if(error || !account) return res.redirect('?invalid');

        if(account && (await bcrypt.compare(req.body.pass, account.pass))==false) return res.redirect('?invalid');
        
        req.session.logged = true;
        req.session.user = req.body.email;
        res.redirect('/content');
    })
})

app.post('/register', (req, res)=>{

  Account.findOne({email: req.body.email}, async(error, account)=>{
      if(error) return res.send('error');
      if(account) return res.send('exists');
      
      const newAccount = new Account({email: req.body.email, pass: (await bcrypt.hash(req.body.pass, 10)), activationKey: (await generateToken()), activated: false});

      newAccount.save(()=>{

        sendActivationMail(req.body.email, req.headers.host + '/activate?key=' + newAccount.activationKey);
        res.send('created');
      })
      
  })
})

app.get('/activate', (req,res)=>{
    Account.findOne({activationKey: req.query.key}, (error, account)=>{
        if(account){
          account.activated = true;
          account.save();
          res.send('Account activated!');
        }else res.send('The link has expired or there is no such account!');
    })
})

app.listen(app.get('port'), ()=>{
    console.log("Server started!");
})


/* HELPERS */
function checkLogin(req, res, next){
    if(req.session.logged){
      return next();
    }else {
      return res.redirect('/login');
    }
}

function sendActivationMail(recipient, url){
  mailer.sendMail({
    from: process.env.mailerUser,
    to: recipient,
    subject: 'Account created!',
    text: `Welcome! You can activate your account here: http://${url}`,
    html: `<div>
              <h1>Welcome!</h1>
              To activate your account click <a href='http://${url}'>here</a>
            </div>`
  })
}

async function generateToken(){
    let account = true;

    while(account){ // generate new token as long as it's not unique

      var token = (await crypto.randomBytes(30)).toString('hex');
      account = await Account.findOne({activationKey: token});
    }
    return token;
}

