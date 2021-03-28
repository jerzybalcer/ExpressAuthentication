const express = require('express');
const session = require('express-session');
const Account = require('./accountSchema');
const mongoDB = require('./database');
const mailer = require('./mailer');

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

    Account.findOne({email: req.body.email, pass: req.body.pass}, (error, account)=>{
        if(error || !account) return res.redirect('?invalid');
        
        req.session.logged = true;
        req.session.user = req.body.email;
        res.redirect('/content');
    })
})

app.post('/register', (req, res)=>{

  Account.findOne({email: req.body.email}, (error, account)=>{
      if(error) return res.send('error');
      if(account) return res.send('exists');
      else{
        const newAccount = new Account({email: req.body.email, pass: req.body.pass, activated: false});
        newAccount.save(()=>{
          res.send('created');
        })
      }
  })
})

app.listen(app.get('port'), ()=>{
    console.log("Server started!");
})

function checkLogin(req, res, next){
    if(req.session.logged){
      return next();
    }else {
      return res.redirect('/login');
    }
}