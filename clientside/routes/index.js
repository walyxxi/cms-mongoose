var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('superagent');
const moment = require('moment');
const helpers = require('../helpers/util');

router.get('/', (req, res) => {
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/line', (req, res) => {
    res.render('line', { title: 'Line', data: req.user, moment });
});

router.get('/pie', (req, res) => {
    res.render('pie', { title: 'Pie', data: req.user });
});

router.get('/bar', (req, res) => {
    res.render('bar', { title: 'Bar', data: req.user });
});

router.get('/maps', (req, res) => {
    res.render('maps', { title: 'Maps', data: req.user });
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
    res.render('data', { title: 'Data', data: req.user, nav: 2 });
})

router.get('/datadate', helpers.isLoggedIn, (req, res) => {
    res.render('datadate', { title: 'Data Date', data: req.user, nav: 3, moment });
})

router.get('/map', helpers.isLoggedIn, (req, res) => {
    res.render('map', { title: 'Maps', data: req.user, nav: 4 });
})

// LOGOUT ==============================
router.get('/logout', (req, res) => {
    request
        .get('http://localhost:3001/api/users/destroy')
        .set('x-access-token', req.user.token)
        .then(res => {
            req.logout();
            res.redirect('/');
        })
        .catch(err => {
            req.flash('Something is wrong, please call your administrator')
            res.redirect('/');
        })
        
});

module.exports = router;
