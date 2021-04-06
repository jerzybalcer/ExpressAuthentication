const Account = require('../database/accountSchema.js');

// check if user activated his account
module.exports = (req, res, next) => {
    Account.findOne({email: req.session.user}, (error, account)=>{
      if(error || !account) return res.sendStatus(404); // there's no such account or error occured
      if(!account.activated) return res.sendStatus(403); // account not activated, block further access!
  
      req.session.account = account; // save account object to session variable
      next(); // passed, go to next middleware
    })  
  }