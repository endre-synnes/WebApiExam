/*
    INFO:
    This file is inspired by The Web And API design lecture 11, but extended for more functionality.
 */

const Game = require('../service/Game');
const Quiz = require("../model/Quiz");


/*
    Map from user id to ongoing match
 */
const userIdToGame = new Map();

/*
    Map from match id to ongoing match
 */
const gameIdToGame = new Map();

function startMatch(playerIds){

  const quizzes = Quiz.getAllQuizzes((err, quizzes) => {

    if (err) {
      console.log("error:");
      console.log(err);
      return;
    }

    if (quizzes.length === 0) {
      return;
    }

    let randomQuizCategory = quizzes[getRandomQuizNumber(quizzes.length)].category;
    let quizzesToPlay = quizzes.filter(quiz => quiz.category === randomQuizCategory);

    const game = new Game(playerIds, deleteMatch, quizzesToPlay, randomQuizCategory);
    console.log("Starting a new game id : " + game.gameId);

    playerIds.forEach(id => userIdToGame.set(id, game));
    gameIdToGame.set(game.gameId, game);
    }

  );
}

function getRandomQuizNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
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

  userIdToGame.delete(userId);
}



module.exports = {startMatch, forfeit};