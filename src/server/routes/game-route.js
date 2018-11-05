const express = require("express");
const PlayerQueue = require("../service/PlayerQueue");
const OngoingMatches = require("../service/OngoingMatches");
const router = express.Router();


router.post('/api/game', (req, res) => {

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

  if (PlayerQueue.getOrganizer() === req.user.id){
    res.status(201).json({isOrganizer: true});
    return;
  }
  console.log(PlayerQueue.size());
  res.status(201).json({isOrganizer: false});
});

router.post('/api/start', (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  if (PlayerQueue.size() < 2) {
    console.log("You need more players");
    res.status(400).send({message: "You need more players"});
    return;
  }

  queue = PlayerQueue.getQueue();

  //TODO use queue to check for active players and start game


  PlayerQueue.emptyQueue();
});

module.exports = router;