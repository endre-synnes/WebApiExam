import LeaderBoard from "../../client/components/game/LeaderBoard";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const LeaderBoardSchema = new Schema({
  playerId: {
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

module.exports.getLeaderBoardByPlayerId = (playerId, callback) => {
  const query = {playerId: playerId};
  LeaderBoard.findOne(query, callback);
};

module.exports.getLeaderBoardById = (id, callback) => {
  LeaderBoard.findById(id, callback);
};

module.exports.increaseWins = (playerId, callback) => {
  LeaderBoard.find({playerId : playerId}, function (err, docs) {
    if (docs.length){
      LeaderBoard.findOneAndUpdate(
        { "playerId" : playerId },
        { $inc: { "wins" : 1 } },
        {new: true},
        callback
      );
    }else{
      console.log("User not found");
      callback();
    }
  });



};