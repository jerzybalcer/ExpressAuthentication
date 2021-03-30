const nodemailer = require('nodemailer');

mailer = nodemailer.createTransport({
    service: process.env.mailerService,
    auth: {
      user: process.env.mailerUser,
      pass: process.env.mailerPass
    }
});

function sendActivationMail(recipient, url, type){
  mailer.sendMail({
    from: process.env.mailerUser,
    to: recipient,
    subject: 'Account created!',
    text: `Welcome! You can activate your account here: http://${url}`,
    html: `<div>
              <h1>Welcome!</h1>
              To activate your account click <a href='http://${url}'>here</a><br>
              (The link is only active for 30 minutes)
            </div>`
  })
}

function sendResetMail(recipient, url){
  mailer.sendMail({
    from: process.env.mailerUser,
    to: recipient,
    subject: 'Reset your password',
    text: `In order to reset your password click here: http://${url}`,
    html: `<div>
              <h1>Welcome!</h1>
              In order to reset your password click <a href='http://${url}'>here</a><br>
              (The link is only active for 30 minutes)
            </div>`
  })
}

exports.sendActivationMail = sendActivationMail;
exports.sendResetMail = sendResetMail;