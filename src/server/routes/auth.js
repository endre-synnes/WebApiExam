const express = require("express");
const router = express.Router();
const passport = require("passport");
//const gravatar = require("gravatar");

// Load input validation
//const validateRegisterInput = require("../../validation/register");

// Load User model
const User = require("../model/User");

// @route POST api/users/register
// @dec Register user
// @access Public
router.post("/api/signup", (req, res) => {
  // const { errors, isValid } = validateRegisterInput(req.body);
  //
  // // Check validation
  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      console.log("nothing");
      return res.status(400).json(errors);
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

        //res.send(user).end()
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User
// @access  Public
router.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.send(req.user.username);
  }
);

router.post('/api/logout',(req, res) => {
  req.logout();
  res.status(200).clearCookie('connect.sid', {
    path: '/'
  });
  req.session.destroy(err => {
    res.send(null);
  })
});

router.get("/api/user", (req, res) => {

  /*
      If a user is logged in by providing the right session cookie,
      then Passport will automatically instantiate a valid User object
      and add it to the incoming "req" object
   */

  if(! req.user){
    res.status(401).send();
    return;
  }

  res.status(200).json({username: req.user.id});
});

module.exports = router;
