/*
    INFO:
    This file is inspired by The Udemy course: Advanced React and Redux: 2018 Edition (Made by Stephen Grider)
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load User model
const User = require("../model/User");
const Tokens = require("../ws/tokens");

// @route POST api/signup
// @dec Register user
// @access Public
router.post("/api/signup", (req, res) => {
  if (req.body.username === undefined || req.body.password === undefined ||
      req.body.username.length === 0  || req.body.password.length === 0 ){
    return res.status(400).json({message: "You need to provide both username and password."});
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      console.log("User name in use!");
      return res.status(409).json({message: "Username in use"});
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });

      User.createUser(newUser, function(err, user){
        if(err) throw err;

        if(!user){
          res.status(400).send();
          return;
        }

        passport.authenticate('local')(req, res, () => {
          req.session.save((err) => {
            if (err) {
              return next(err);
            }

            res.status(201).send({username: req.user.username});
          });
        });
      });
    }
  });
});

// @route   GET api/login
// @desc    Login User
// @access  Public
router.post('/api/login', passport.authenticate('local'), (req, res) => {
  if (req.user.username === undefined || req.user.password === undefined ||
    req.user.username.length === 0  || req.user.password.length === 0 ){
    return res.status(400).json({message: "You need to provide both username and password."});
  }

  res.send({username: req.user.username});
  }
);

router.post('/api/wstoken', function (req, res) {
  if(! req.user){
    res.status(401).send();
    return;
  }
  const t = Tokens.createToken(req.user.id);
  res.status(201).json({wstoken: t});
});

// @route   GET api/logout
// @desc    Logging a User out and delete cookie
// @access  Public
router.post('/api/logout',(req, res) => {
  req.logout();

  res.status(200).clearCookie('connect.sid', {
    path: '/'
  });

  req.session.destroy(err => {
    res.send(null);
  })
});

// @route   GET api/user
// @desc    Validate that a session is still active
// @access  Public
router.get("/api/user", (req, res) => {
  if(! req.user){
    res.status(401).send();
    return;
  }

  res.status(200).json({username: req.user.username});
});

router.get('/api/leaderboard', (req, res) => {
  if(! req.user){
    res.status(401).send();
    return;
  }

  User.find(function (err, users) {
    let leaders = users.map(u => {
      return {
        "username": u.username,
        "wins": u.wins
      }
    });

    leaders = leaders.sort(function (a, b) {
      return b.wins - a.wins;
    });

    res.status(200).json({users: leaders})
  })
});

module.exports = router;
