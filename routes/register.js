const bcrypt = require('bcrypt');
const Account = require('../database/accountSchema.js');
const generateToken = require('../helpers/generateToken');
const mailer = require('../helpers/mailer');

module.exports = (req, res) => {

    Account.findOne({email: req.body.email}, async(error, account)=>{ // check if the mail is already in database
        if(error) return res.send('error');
        if(account) return res.send('exists');
  
        // create new account
        const newAccount = new Account({
          email: req.body.email,
          pass: (await bcrypt.hash(req.body.pass, 10)),
          token: (await generateToken()), tokenExpires: Date.now() + 1000*60*30 /*30 mins*/, activated: false
        });
  
        // save the account to database and send activation link via mail
        newAccount.save(()=>{
  
          mailer.sendActivationMail(req.body.email, req.headers.host + '/authorize?action=activate&token=' + newAccount.token);
          res.send('created');
        })
    })
}