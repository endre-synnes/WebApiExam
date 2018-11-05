const express = require("express");
const PlayerQueue = require("../service/PlayerQueue");
const OngoingMatches = require("../service/OngoingMatches");
const router = express.Router();


router.post('/game', (req, res) => {

  if (!req.user) {
    res.status(401).send();
    return;
  }

  if (PlayerQueue.hasUser(req.user.id)) {
    //already in the queue, nothing to do
    res.status(204).send();
    return;
  }

  OngoingMatches.forfeit(req.user.id);

  if (PlayerQueue.size() > 0) {
    console.log("is more than zero users");
  }

  PlayerQueue.addUser(req.user.id);
  res.status(201).send();


});

module.exports = router;