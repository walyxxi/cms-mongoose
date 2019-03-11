var fs = require('fs');
const mongoose = require('mongoose');
var Datadate = require('../models/datadate');
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

mongoose.connect('mongodb://localhost:27017/c30', { useNewUrlParser: true })

var done = 0;
for (let i = 0; i < data.length; i++) {
    Datadate.insertMany(data[i]).then(data => {
        done++;
        if (done === data.length) {
            exit();
        }
    }).catch(err => {
        console.log(err);
    })
}

function exit() {
    mongoose.disconnect();
}
