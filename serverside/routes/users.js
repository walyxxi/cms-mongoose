var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../helpers/config');
const User = require('../models/user');

/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find().then(data => {
    res.json(data);
  }).catch(err => {
    res.send(err)
  })
})

router.post('/register', (req, res, next) => {
  let x = req.body;
  User.findOne({ email: x.email }, (err, userData) => {
    if (err) return res.status(500).send('There was problem finding the User!')
    if (userData) {
      res.json({
        error: true,
        message: `User '${x.email}' already registered, enter the other email!`
      })
    } else {
      if (x.password == x.retypepassword) {
        let hashedPassword = bcrypt.hashSync(x.password, 8);
        let token = jwt.sign({ email: x.email }, config.secret, {
          expiresIn: 86400 // 24 Hours
        })
        User.create({
          email: x.email,
          password: hashedPassword,
          token: token
        }, (err, user) => {
          if (err) return res.status(500).send("There was a problem registering the user!")
          res.status(200).send({
            error: false,
            data: { email: user.email },
            token: user.token
          })
        })
      } else {
        res.json({
          error: true,
          message: 'Password you entered not match!'
        })
      }
    }
  })
})

router.post('/login', (req, res, next) => {
  let x = req.body;
  User.findOne({ email: x.email }, (err, userData) => {
    let passwordIsValid = bcrypt.compareSync(x.password, userData.password);
    if (err) return res.status(500).send('There was problem finding the User!')
    if (!userData) {
      res.json({
        error: true,
        message: `Email '${x.email}' is invalid!`
      })
    } else if (!passwordIsValid) {
      res.json({
        error: true,
        message: `Password is invalid!`
      })
    } else {
      let token = jwt.sign({ email: x.email }, config.secret, {
        expiresIn: 86400 // 24 Hours
      })
      User.updateOne({ email: x.email }, { $set: {token: token} }, (err) => {
        if (err) return res.status(500).send('There was problem updating User Token!')
        res.status(200).send({
          error: false,
          data: { email: x.email },
          token: token
        })
      })
    }
  })
})

router.post('/check', (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ valid: false, message: 'No token provided' });
  jwt.verify(token, config.secret, (err) => {
    if (err) {
      res.json({ valid: false })
    } else {
      res.json({ valid: true })
    }
  })
})

router.get('/destroy', (req, res, next) => {
  let x = req.body;
  User.updateOne({ email: x.email }, { $set: {token: null} }, (err) => {
    if (err) {
      res.json({ logout: false })
    } else {
      res.json({ logout: true })
    }
  })
})

module.exports = router;
