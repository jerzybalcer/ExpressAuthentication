const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    service: process.env.mailerService,
    auth: {
      user: process.env.mailerUser,
      pass: process.env.mailerPass
    }
});