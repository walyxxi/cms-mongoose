module.exports = {
    // route middleware to ensure user is logged in
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
}