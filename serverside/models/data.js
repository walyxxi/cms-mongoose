var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Data = new Schema({
    letter: String,
    frequency: Number
})

module.exports = mongoose.model('Data', Data);