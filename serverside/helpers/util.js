var jwt = require('jsonwebtoken');
var config = require('./config');

module.exports = {
    checkToken: (req, res, next) => {
        var token = req.headers['x-access-token'];
        // console.log(token);
        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.status(500).send({
                        valid: false,
                        message: 'Token invalid.'
                    })
                } else {
                    req.decoded = decoded;
                    next()
                }
            })
        } else {
            return res.status(403).send({
                valid: false,
                message: 'Token not set, please login.'
            })
        }
    }
}