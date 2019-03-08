var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var request = require('superagent');

var indexRouter = require('./routes/index');

const API_URL = 'http://localhost:3001/api/'

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({
  secret: 'maribelajarpassport', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function (user, done) {
  done(null, user);
});/*  */

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
passport.use('local-register', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
}, (req, email, password, done) => {
    if (email)
      email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
    request
      .post(`${API_URL}users/register`)
      .send({ email, password, retypepassword: req.body.retypepassword })
      //.set('X-API-Key', 'foobar')
      .set('Accept', 'application/json')
      .then(res => {
        // console.log(res);
        if (!res.body.error) {
          return done(null, res.body.data);
        } else {
          return done(null, false, req.flash('registerMessage', res.body.message));
        }
      })
      .catch(err => {
        // console.log(err);
        if (err) return done(null, false, req.flash('registerMessage', 'Something is wrong, please call your administrator'));
      })
  }));

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
}, (req, email, password, done) => {
    if (email)
      email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
    request
      .post(`${API_URL}users/login`)
      .send({ email, password })
      .set('Accept', 'apllication/json')
      .then(res => {
        if (!res.body.error) {
          return done(null, res.body.data)
        } else {
          return done(null, false, req.flash('loginMessage', res.body.message))
        }
      })
      .catch(err => {
        if (err) return done(null, false, req.flash('loginMessage', 'Something is wrong, please call your administrator'));
      })
  }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
