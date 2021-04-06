const Account = require('../database/accountSchema.js');
const crypto = require('crypto');

// generate a token for athorizing various actions via email
module.exports = async () => {
    let account = true;

    while(account){ // generate new token as long as it's not unique

      var token = (await crypto.randomBytes(30)).toString('hex');
      account = await Account.findOne({token: token});
    }
    return token;
}