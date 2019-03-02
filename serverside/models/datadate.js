var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Datadate = new Schema({
    letter: Date,
    frequency: Number
})

module.exports = mongoose.model('Datadate', Datadate);