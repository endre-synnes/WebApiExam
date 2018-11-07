const Quiz = require("../model/Quiz");
const crypto = require("crypto");
const ActivePlayers = require("./ActivePlayers");
const GameState = require("../../shared/GameState");

class Game {

  constructor(playerIds, callbackWhenFinished, quizzes){

    this.playerIds = playerIds;
    this.counter = 0;
    this.gameId = this.randomId();
    this.quizzes = quizzes;

    this.currentQuestion = quizzes[0];

    console.log("current question");
    console.log(this.currentQuestion);

    this.gameState = new GameState(this.playerIds, {
      questionId: this.currentQuestion._id,
      question: this.currentQuestion.question,
      alternatives: this.currentQuestion.alternatives,
      category: this.currentQuestion.category
    });


    //TODO initiate timer

    //TODO start game

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

    /*
        When a new match is started, we need to update
        both players, to inform them who has the first move.
     */
    this.playerIds.forEach(player => this.sendState(player));
  }

  registerListener(playerId) {
    /*
            The users will send messages on the WS each time they make a move.
            So, we need to register a listener on the event "insertion" for
            the sockets associated to the 2 players
         */

    const socket = this.sockets.get(playerId);

    /*
        A player could play many matches, in sequence, on the same socket.
        Once a match is over, we should not read any further message for it.
        A user should be able to play only 1 match at a time.
        At each new match, we need to register a new handler for the
        "insertion" event, bound to the current match.
        But you need to be careful: "socket.on" does NOT replace the current
        handler, but rather add a new one.
        For the same event, you can have many handlers active at the same time.
        So, to avoid problems, we just delete all existing handlers when a new
        match is started, as anyway a user can play only 1 match at a time.
     */
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

      /*
          We start with some input validation, eg checking if the received
          message was really meant for this ongoing match.
       */

      console.log(typeof questionId);
      console.log(typeof expectedQuestionId);

      if(questionId !== expectedQuestionId){
        socket.emit("update", {error: "Invalid operation"});
        console.log("Invalid counter: "+questionId+" !== " + expectedQuestionId);
        return;
      }

      if(gameId !== this.gameId){
        console.log("Invalid matchId: "+gameId+" !== " + this.gameId);
        return;
      }

      /*
          WARNING: the checks above are a starting point, but they are
          not sufficient. For example, we are not checking if the position
          is valid.
          You might think that, if the code in the frontend (ie bundle.js) is
          bug-free, then that should not be a problem.
          But a logged in user could craft messages manually with a program.

          This is a issue. For example, this game is NOT secure, even if we
          are using authentication on the WS socket channels.
          For example, it can be "easy" for a user to CHEAT.
          When a user sends its move via the socket, it can craft immediately
          a second message representing the move of the opponent, by just
          using "counter+1" in data.counter.

          This problem can be fixed here by checking if the move for action with
          index "counter" is actually expected to come from this user's socket and
          not the opponent.
       */

      //update the state of the game

      //TODO Check for correct answer and update score
      //this.board.selectColumn(position);

      //send such state to the opponent

      //TODO after countdown send new state to players
      //this.sendState(this.opponentId(playerId));

      if(this.counter === this.quizzes.length  - 1){
        this.callbackWhenFinished(this.gameId);
      }

      //TODO checkouing for correct answer
      if (answerIndex === this.currentQuestion.correctIndex) {

        //TODO implement check for index
        console.log("correct answer!!");
        this.currentQuestion = this.quizzes[1];

        this.gameState.nextQuestion({
          questionId: this.currentQuestion._id,
          question: this.currentQuestion.question,
          alternatives: this.currentQuestion.alternatives,
          category: this.currentQuestion.category
        });

        this.playerIds.forEach(player => this.sendState(player));

      }

      //TODO save score

      //TODO send newxt question after counter finished

    });
  }

  nextQuestion(){

  }

  sendState(playerId) {
    console.log("Sending update to '"+playerId+"' for match " + this.gameId);

    const payload = {
      data: {
        gameId: this.gameId,
        gameState: this.gameState.returnDto(),
        players: this.playerIds
      }
    };

    const socket = this.sockets.get(playerId);

    socket.emit('update', payload);
  }
}

module.exports = Game;