var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = mongoose.model('Users')


passport.use(new LocalStrategy(
    function (username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ))

router.get('/', function(req, res, next){
    User.find({}, function(err, user){
        res.send(user)
    })
})

// Login
router.post('/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json(
        { message: 'Please fill out email and password' });
    }
    passport.authenticate('local', function (err, user, info) {
      if (err) { return next(err); }
      if (user) {
        return res.json({ token: user.generateJWT() });
      } else {
        return res.status(401).json(info);
      }
    })(req, res, next);
  });


  //Register user
router.post('/register', function (req, res, next) {

    if (!req.body.username || !req.body.password) {
      return res.status(400).json(
        { message: 'Please fill out all fields' });
    }
  
    User.findOne({ email: req.body.username }, function (err, data) {
      if (err) { 
        console.log(err)
        throw err
      }
      
      if (!data) {
        let user = new User();
        user.email = req.body.username;
        user.setPassword(req.body.password)
        user.save(function (err) {
          if (err) { return next(err); }
          return res.json({ token: user.generateJWT() })
        });
  
      } else {
        return res.status(401).send({ message: 'User already exists.' });
      }
    });
  });
  
router.param('user', function (req, res, next, id) {
    let query = User.findById(id);
    query.exec(function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('not found ' + id));
      }
      req.user = user;
      return next();
    });
  });

 router.post('/checkusername', function (req, res, next) {
    User.find({ email: req.body.username },
      function (err, result) {
        if (result.length) {
          res.json({ 'email': 'alreadyexists' })
        } else {
          res.json({ 'email': 'ok' })
        }
      });
  });

  module.exports = router