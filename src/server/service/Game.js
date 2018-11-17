/*
    INFO:
    This file is inspired by The Web And API design lecture 11, but extended for more functionality and to work with quizzes.
 */

const crypto = require("crypto");
const ActivePlayers = require("./ActivePlayers");
const GameState = require("./GameState");
const User = require("../model/User");

class Game {

  constructor(playerIds, callbackWhenFinished, quizzes, category){

    this.userIdToCurrentScore = new Map();
    this.userIdToQuestion = [];

    this.category = category;
    this.nameOfWinner = null;
    this.playerIds = playerIds;
    this.counter = 0;
    this.gameId = this.randomId();
    this.quizzes = quizzes;
    this.gameFinished = false;

    this.millisecondsTimer = 10000;
    this.currentQuizTimer = new Date();


    this.currentQuestion = quizzes[0];

    console.log("current question");
    console.log(this.currentQuestion);

    this.gameState = new GameState(this.playerIds, {
      questionId: this.currentQuestion._id,
      question: this.currentQuestion.question,
      alternatives: this.currentQuestion.alternatives,
      category: this.currentQuestion.category
    });

    this.sockets = new Map();
    playerIds.forEach(id => this.addPlayersToGame(id));

    this.callbackWhenFinished = callbackWhenFinished;

    this.start();

  }

  randomId(){
    return crypto.randomBytes(10).toString('hex');
  }

  addPlayersToGame(playerId){
    this.sockets.set(playerId, ActivePlayers.getSocket(playerId))
  }

  start(){

    this.playerIds.forEach(player => this.registerListener(player));
    this.playerIds.forEach(player => this.userIdToCurrentScore.set(player, 0));
    this.playerIds.forEach(player => this.sendState(player));

    let timer = setInterval(() => this.nextQuestion(this.quizzes), this.millisecondsTimer);
    setTimeout(() => { clearInterval(timer); console.log("timer ended")}, this.millisecondsTimer * (this.quizzes.length+1))
  }

  registerListener(playerId) {
    const socket = this.sockets.get(playerId);

    socket.removeAllListeners('insertion');

    socket.on('insertion', data => {

      if (data === null || data === undefined) {
        socket.emit("update", {error: "No payload provided"});
        return;
      }

      console.log("data from insertion");
      console.log(data);

      const questionId = data.questionId;
      const answerIndex = data.answerIndex;
      const gameId = data.gameId;

      console.log("Handling message from '" + playerId+"' for questionId " + questionId
        + " in match " + this.gameId);

      const expectedQuestionId = this.gameState.questionDto.questionId.toString();

      if(questionId !== expectedQuestionId){
        socket.emit("update", {error: "Illegal answer for this quiz!"});
        console.log("Invalid counter: "+questionId+" !== " + expectedQuestionId);
        return;
      }

      if(gameId !== this.gameId){
        socket.emit("update", {error: "Wrong game!"});
        console.log("Invalid matchId: "+gameId+" !== " + this.gameId);
        return;
      }

      if(this.userIdToQuestion.includes(playerId)){
        socket.emit("update", {error: "You have already answered this question!!"});
        return;
      }

      if (!this.gameFinished && answerIndex === this.currentQuestion.correctIndex) {
        this.userIdToQuestion.push(playerId);
        console.log("correct answer!!");
        let endTime = new Date();
        let maxScore = 1000;
        let diff = (this.currentQuizTimer - endTime) / 10;

        const newScore = this.userIdToCurrentScore.get(playerId) + (maxScore + diff);
        this.userIdToCurrentScore.set(playerId, newScore);
        console.log(`new score: ${newScore}`);
      }

    });
  }

  nextQuestion(quizzes){
    this.currentQuizTimer = new Date();
    this.counter += 1;
    this.userIdToQuestion = [];

    if (this.counter >= this.quizzes.length) {
      this.endGame();
    } else {
      this.currentQuestion = quizzes[this.counter];
      this.gameState.nextQuestion({
        questionId: this.currentQuestion._id,
        question: this.currentQuestion.question,
        alternatives: this.currentQuestion.alternatives,
        category: this.currentQuestion.category
      });

      this.playerIds.forEach(player => this.sendState(player));
    }

  }

  endGame(){
    this.gameFinished = true;

    let currentMax = 0;
    let idOfWinner = null;

    this.userIdToCurrentScore.forEach((value, key) => {
      if (value > currentMax) {
        currentMax = value;
        idOfWinner = key;
      }
    });

    if (idOfWinner) {
      User.updateWins(idOfWinner, (error, user) => {
        console.log("winner is saved, response: ");
        console.log(user);
        this.nameOfWinner = user.username;
        this.playerIds.forEach(player => this.sendState(player));
      })
    } else {
      this.playerIds.forEach(player => this.sendState(player));

    }
    this.callbackWhenFinished(this.gameId);
  }

  sendState(playerId) {
    console.log("Sending update to '"+playerId+"' for match " + this.gameId);

    const payload = {
      data: {
        gameId: this.gameId,
        gameState: this.gameState.returnDto(),
        players: this.playerIds,
        gameFinished: this.gameFinished,
        winner: this.nameOfWinner,
        timer: this.millisecondsTimer,
        category: this.category
      }
    };

    const socket = this.sockets.get(playerId);
    socket.emit('update', payload);
  }

}

module.exports = Game;