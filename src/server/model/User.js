const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

// Create schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  wins: {
    type: Number,
    default: 0
  }
});

module.exports = User = mongoose.model("users", UserSchema);

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getUserByUsername = (username, callback) => {
  const query = {username: username};
  User.findOne(query, callback);
};

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.updateWins = (id, callback) => {
  User.findByIdAndUpdate(
    id,
    { $inc: { "wins" : 1 } },
    {new: true},
    callback);
};
