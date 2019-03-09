var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('superagent');
const helpers = require('../helpers/util');

router.get('/', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

// SIGNUP =================================
// show the signup form
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', message: req.flash('registerMessage') });
});

// process the signup form
router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/home', // redirect to the secure admin section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// SIGNIN =================================
// show the signin form
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', message: req.flash('loginMessage') });
});

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', // redirect to the secure admin section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

router.get('/home', helpers.isLoggedIn, (req, res) => {
    res.render('home', { title: 'Home', data: req.user, nav: 1 });
});

router.get('/data', helpers.isLoggedIn, (req, res) => {
    res.render('data', { title: 'Data', data: req.data, nav: 2 });
})

// LOGOUT ==============================
router.get('/logout', (req, res, done) => {
    request
        .get('http://localhost:3001/api/users/destroy')
        .set('x-access-token', req.user.token)
        .then(res => {
            return done(null, req.logout());
        })
        .catch(err => {
            if (err) return done(null, false, req.flash('Something is wrong, please call your administrator'));
        })
        res.redirect('/');
});

module.exports = router;
