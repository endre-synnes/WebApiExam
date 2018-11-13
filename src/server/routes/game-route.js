const express = require("express");
const PlayerQueue = require("../service/PlayerQueue");
const ActivePLayers = require("../service/ActivePlayers");
const OngoingMatches = require("../service/OngoingMatches");
const router = express.Router();

//TODO implementer endepunkt for å lage quiz

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
    console.log(`Number of players already in queue: ${PlayerQueue.size()}` );
  }

  PlayerQueue.addUser(req.user.id);

  if (PlayerQueue.getOrganizer() === req.user.id){
    res.status(201).json({isOrganizer: true});
    return;
  }
  res.status(201).json({isOrganizer: false});
});

router.delete('/api/leaveGame', (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }
  if (PlayerQueue.getOrganizer() === req.user.id){
    PlayerQueue.emptyQueue();
    res.status(204);
    return;
  }

  PlayerQueue.removeUser(req.user.id);
  res.status(204).send();
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
  console.log("queue:");
  console.log(queue);
  console.log("----------------");

  const activePlayers = queue.filter(active => ActivePLayers.isActive(active));

  console.log("active players to join this game:");
  activePlayers.forEach(e => console.log(e));
  console.log("-------------------");

  OngoingMatches.startMatch(activePlayers);

  PlayerQueue.emptyQueue();

  res.status(201).json({started: true});
});

module.exports = router;