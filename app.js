const express = require('express');
const session = require('express-session');

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
    if(req.body.email === "123" && req.body.pass === "123"){
        req.session.logged = true;
        req.session.user = req.body.mail;
        res.redirect('/content');
      }else{
        res.redirect('?invalid');
      }
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