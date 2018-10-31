const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/User");
const passport = require("passport");

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    (username, password, done) => {

      User.getUserByUsername(username,(err, user) => {
        if (err) {
          console.log("Får du error?");
          console.log(err);

          throw err;
        }

        if (!user) {
          return done(null, false, { message: "Unknown User" });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {

  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});