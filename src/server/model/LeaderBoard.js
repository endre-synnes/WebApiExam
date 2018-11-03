const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const LeaderBoardSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  wins: {
    type: Number,
    required: true
  }
});

module.exports = LeaderBoard = mongoose.model("leaderboard", LeaderBoardSchema);

module.exports.createLeaderBoard = (newLeaderBoard, callback) => {
  newLeaderBoard.save(callback);
};

module.exports.getLeaderBoardByUsername = (username, callback) => {
  const query = {username: username};
  LeaderBoard.findOne(query, callback);
};

module.exports.getLeaderBoardById = (id, callback) => {
  LeaderBoard.findById(id, callback);
};