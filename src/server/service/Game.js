const Quiz = require("../model/Quiz");
const crypto = require("crypto");
const ActivePlayers = require("./ActivePlayers");

class Game {

  constructor(playerIds, callbackWhenFinished){

    this.quizzes = Quiz.getAllQuizzes();

    this.playerIds = playerIds;

    this.gameId = this.randomId();

    this.sockets = new Map();
    playerIds.forEach(id => this.addPlayersToGame(id));

    this.callbackWhenFinished = callbackWhenFinished;
  }


  randomId(){
    return crypto.randomBytes(10).toString('hex');
  }

  addPlayersToGame(playerId){
    this.sockets.set(playerId, ActivePlayers.getSocket(playerId))
  }

  start(){

    this.playerIds.forEach(player => this.registerListener(player));

    /*
        When a new match is started, we need to update
        both players, to inform them who has the first move.
     */
    this.playerIds.forEach(player => this.sendState(player));
  }


  registerListener(playerId) {
    return undefined;
  }

  sendState(playerId) {
    return undefined
  }
}