const Account = require('../database/accountSchema.js');
const generateToken = require('../helpers/generateToken');
const mailer = require('../helpers/mailer');

module.exports = (req, res) => {

    Account.findOne({email: req.body.email}, async(error, account)=>{

        if(account){ // can't assign authorize token to non-existing account
        // generate password reset authorize token, then save it to database and send it via mail
        account.token = await generateToken();
        account.tokenExpires = Date.now() +  1000*60*30 /*30 mins*/;
        account.save();
        mailer.sendResetMail(req.body.email, req.headers.host + '/authorize?action=reset&token=' + account.token);
        }
    })
    res.sendStatus(200); // send OK anyway
}