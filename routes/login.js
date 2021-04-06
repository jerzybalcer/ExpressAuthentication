const Account = require('../database/accountSchema.js');
const bcrypt = require('bcrypt');

module.exports = (req, res)=>{

    Account.findOne({email: req.body.email}, async(error, account)=>{

        if(error || !account) return res.redirect('?invalid'); // there's no such account or error was thrown while searching database

        // check if the found account has the same password as entered by user
        if(account && (await bcrypt.compare(req.body.pass, account.pass))==false) return res.redirect('?invalid');
        
        // passwords are matching, flag session as logged and redirect to user's content
        req.session.logged = true;
        req.session.user = req.body.email;
        res.redirect('/content');
    })
}