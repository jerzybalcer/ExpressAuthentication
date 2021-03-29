const mongoose = require('mongoose');

// Schema for creating user account
let accountSchema = new mongoose.Schema({
    email: String,
    pass: String,
    activationKey: String,
    keyExpires: Number,
    activated: Boolean
})

module.exports = mongoose.model('Account', accountSchema);