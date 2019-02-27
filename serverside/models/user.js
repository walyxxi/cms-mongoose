var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User = new Schema({
    email: String,
    password: String,
    token: String,
})

module.exports = mongoose.model('User', User);