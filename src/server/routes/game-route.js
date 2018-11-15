const express = require("express");
const PlayerQueue = require("../service/PlayerQueue");
const ActivePLayers = require("../service/ActivePlayers");
const OngoingMatches = require("../service/OngoingMatches");
const ActivePlayers = require("../service/ActivePlayers");
const router = express.Router();

router.post('/api/game', (req, res) => {

  if (!req.user) {
    res.status(401).send();
    return;
  }

  if (PlayerQueue.hasUser(req.user.id)) {
    console.log("already in queue");
    //already in the queue, nothing to do
    res.status(204).send();
    return;
  }

  OngoingMatches.forfeit(req.user.id);
  if (PlayerQueue.size() > 0) {
    console.log(`Number of players already in queue: ${PlayerQueue.size()}` );
  }

  PlayerQueue.addUser(req.user.id);
  let organizer = PlayerQueue.getOrganizer();

  if (organizer === req.user.id){
    res.status(201).json({isOrganizer: true});
    return;
  }

  // Sending update to organizer that he/she can start the game
  const socket = ActivePlayers.getSocket(organizer);
  socket.emit("readyToStart", {
    canStart: true ,
    playerCount : PlayerQueue.size()
  });

  res.status(201).json({isOrganizer: false});
});

router.delete('/api/leaveGame', (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }
  if (PlayerQueue.getOrganizer() === req.user.id){
    let queue = PlayerQueue.getQueue();

    queue.forEach( (user) => {
      const socket = ActivePlayers.getSocket(user);
      socket.emit("gameCanceled", {
        canceled: true ,
        message : "Organizer left the game."
      });
    });

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
  const activePlayers = queue.filter(active => ActivePLayers.isActive(active));

  OngoingMatches.startMatch(activePlayers);
  PlayerQueue.emptyQueue();
  res.status(201).json({started: true});
});

module.exports = router;