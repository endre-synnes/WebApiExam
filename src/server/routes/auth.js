const express = require("express");
const router = express.Router();
const passport = require("passport");
//const gravatar = require("gravatar");

// Load input validation
//const validateRegisterInput = require("../../validation/register");

// Load User model
const User = require("../model/User");
const Tokens = require("../ws/tokens");

// @route POST api/signup
// @dec Register user
// @access Public
router.post("/api/signup", (req, res) => {
  //TODO implement validation of request body
  // const { errors, isValid } = validateRegisterInput(req.body);
  //
  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      console.log("User name in use!");
      return res.status(409).json({message: "Username in use"});
    } else {
      // const avatar = gravatar.url(req.body.email, {
      //   s: "200", // Size
      //   r: "pg", // Rating
      //   d: "mm" // Default
      // });

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

            res.status(204).send();
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
    res.send(req.user.username);
  }
);

router.post('/wstoken', function (req, res) {

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

  res.status(200).json({username: req.user.id});
});

module.exports = router;
