const Game = require('../service/Game');


/*
    Map from user id to ongoing match
 */
const userIdToGame = new Map();

/*
    Map from match id to ongoing match
 */
const gameIdToGame = new Map();


function startMatch(playerIds){

  const game = new Game(playerIds, deleteMatch);

  console.log("Starting a new game id : " + game.gameId);

  playerIds.forEach(id => userIdToGame.set(id, game));
  gameIdToGame.set(game.gameId, game);

  game.start();
}

function deleteMatch(gameId){
  const game = gameIdToGame.get(gameId);
  if(game === undefined){
    return;
  }

  game.playerIds.forEach(id => userIdToGame.delete(id));
  gameIdToGame.delete(game.gameId);
}

function forfeit(userId){

  const game = userIdToGame.get(userId);
  if(game === undefined){
    return;
  }

  game.playerIds.forEach(id => userIdToGame.delete(id));
  gameIdToGame.delete(game.gameId);

  //game.sendForfeit(userId);
}



module.exports = {startMatch, forfeit};