const Account = require('../database/accountSchema.js');

module.exports = (req, res) => {

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
}