var express = require('express');
var router = express.Router();
var passport = require('passport');
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
    res.render('home', {
        data : req.user,
        nav: nav = 1,
        title: 'Home'
    });
});

// LOGOUT ==============================
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
