var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/c30', { useNewUrlParser: true })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var datasRouter = require('./routes/datas');
var datadatesRouter = require('./routes/datadates');
var mapsRouter = require('./routes/maps');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/datas', datasRouter);
app.use('/api/datadates', datadatesRouter);
app.use('/api/maps', mapsRouter);

module.exports = app;
