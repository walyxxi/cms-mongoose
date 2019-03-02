var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Map = new Schema({
    title: String,
    lat: Number,
    lng: Number
})

module.exports = mongoose.model('Map', Map);