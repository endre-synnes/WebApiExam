import React, {Component} from "react";
import requireAuth from "./../requireAuth";
import openSocket from 'socket.io-client';
import {Link} from "react-router-dom";
import Countdown from "react-countdown-now";

class Lobby extends Component {
  constructor(props){
    super(props);

    this.state = {
      gameId: null,
      gameState: null,
      players: null,
      errorMsg: null,
      isOrganizer: false,
      gameFinished: false,
      quizAnswered: false,
      winner: null,
      timer: null,
      gameStarted: false,
      newQuestion: false,
      category: null,
      canStart: false,
      playerCount: null,
      gameCanceled: false
    };
  }

  componentDidMount() {
    this.connectToGame = this.connectToGame.bind(this);
    this.makeGuess = this.makeGuess.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
    this.renderError = this.renderError.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.socket = openSocket(window.location.origin);

    this.socket.on("update",  (dto) => {

      if (dto === null || dto === undefined) {
        this.setState({errorMsg: "Invalid response from server."});
        return;
      }

      if (dto.error !== null && dto.error !== undefined) {
        this.setState({errorMsg: dto.error});
        return;
      }

      const data = dto.data;
      this.setState({
        quizAnswered: false,
        gameId: data.gameId,
        gameState: data.gameState,
        players: data.players,
        isOrganizer: data.isOrganizer,
        gameFinished: data.gameFinished,
        winner: data.winner,
        timer: data.timer,
        gameStarted: true,
        newQuestion: true,
        category: data.category
      });
      this.socket.on('disconnect', () => {
        this.setState({errorMsg: "Disconnected from Server."});
      });

    });

    this.logInWithWebToken().then(
      this.connectToGame
    );

    this.socket.on("readyToStart", (conditions) => {
      if (conditions === null || conditions === undefined) {
        this.setState({errorMsg: "Invalid response from server."});
        return;
      }

      this.setState({
        canStart: conditions.canStart,
        playerCount: conditions.playerCount
      })

    });

    this.socket.on("gameCanceled", (dto) => {
      if (dto === null || dto === undefined) {
        this.setState({errorMsg: "Invalid response from server."});
        return;
      }

      this.setState({
        gameCanceled : dto.canceled,
        errorMsg: dto.message
      })
    })
  }

  async connectToGame(){
    this.setState({
      gameId: null,
      gameState: null,
      players: null,
      errorMsg: null,
      isOrganizer: false,
      gameFinished: false,
      quizAnswered: false,
      winner: null,
      timer: null,
      gameStarted: false,
      newQuestion: false,
      category: null,
      canStart: false,
      playerCount: null,
      gameCanceled: false
    });

    const url = "/api/game";
    let response;
    try {
      response = await fetch(url, {
        method: "post"
      });
    } catch (err) {
      this.setState({errorMsg: "Failed to connect to server: " + err});
      return;
    }

    if (response.status === 401) {
      this.setState({errorMsg: "You should log in first"});
      return;
    }

    if (response.status !== 201 && response.status !== 204) {
      this.setState({errorMsg: "Error when connecting to server: status code " + response.status});
      return;
    }

    const payload = await response.json();
    this.setState({isOrganizer: payload.isOrganizer});
  }

  startTimer(){
    if (this.state.gameStarted && !this.state.gameFinished && this.state.timer && !this.state.quizAnswered) {
      return (
        <div>
          <h3><Countdown date={Date.now() + this.state.timer}/></h3>
        </div>
      );
    } else if (this.state.gameStarted && !this.state.gameFinished && this.state.quizAnswered) {
        return <div>Waiting for next question...</div>;
    }

  }

  async startGame(){
    const url = "/api/start";
    let response;
    try {
      response = await fetch(url, {
        method: "post"
      });
    } catch (err) {
      this.setState({errorMsg: "Failed to start game."});
      return;
    }

    if (response.status === 400) {
      console.log(response);
      this.setState({errorMsg: "You need more players to start the game"});
      return;
    }
  }

  renderStartGameView(){
    if (this.state.isOrganizer && !this.state.gameState) {
      if (this.state.canStart) {
        return <div>
          <h4>Start a new game!</h4>
          <p>Number of players in queue: {this.state.playerCount}</p>
          <button onClick={this.startGame} className="btn btn-dark">Start new Game</button>
        </div>
      } else {
        return <div>
          <h4>Waiting for enough players to start the game!</h4>
        </div>
      }
    } else if (!this.state.isOrganizer && !this.state.gameState && !this.state.gameCanceled) {
      return <div>
        <h4>Waiting for organiser to start the game...</h4>
      </div>
    } else if (this.state.gameCanceled) {
      return <div>
        <Link to="/" className="btn btn-dark">Exit</Link>
        <button onClick={this.connectToGame} className="btn btn-dark">New Game</button>
      </div>
    }
  }

  render() {
    return (
      <div>
        {this.renderError()}
        {this.renderStartGameView()}
        {this.renderQuiz()}
        {this.startTimer()}
      </div>
    );
  };

  renderError(){
    if (this.state.errorMsg) {
      return <div>
        <h3>{this.state.errorMsg}</h3>
      </div>
    }
  }

  renderQuiz(){
    if (this.state.gameState && !this.state.gameFinished) {
      return <div>
        <h4>{this.state.gameState.question}</h4>
        <p>Category: {this.state.category}</p>
        <button onClick={() => this.makeGuess(0)} className="btn">{this.state.gameState.alternatives[0]}</button>
        <button onClick={() => this.makeGuess(1)} className="btn">{this.state.gameState.alternatives[1]}</button>
        <button onClick={() => this.makeGuess(2)} className="btn">{this.state.gameState.alternatives[2]}</button>
        <button onClick={() => this.makeGuess(3)} className="btn">{this.state.gameState.alternatives[3]}</button>
        </div>
    }
    else if (this.state.quizAnswered) {
      return <div>Waiting for others ...</div>
    } else if (this.state.gameFinished) {
      return <div>
        <h3>Good game!</h3>
        <h5>The winner is: {this.state.winner}</h5>
        <Link to="/" className="btn btn-dark">Exit</Link>
        <button onClick={this.connectToGame} className="btn btn-dark">New Game</button>
      </div>
    }
  }

  async logInWithWebToken(){
    const url = "/api/wstoken";
    let response;
    try {
      response = await fetch(url, {
        method: "post"
      });

      const payload = await response.json();
      this.socket.emit('login', payload);

    } catch (err) {
      this.setState({errorMsg: "Failed to connect to server: " + err});
      return;
    }
  }

  makeGuess(index){
    if (this.state.gameState && !this.state.quizAnswered) {
      this.socket.emit('insertion', {
        questionId: this.state.gameState.questionId,
        answerIndex: index,
        gameId: this.state.gameId
      });
      this.setState({
        quizAnswered: true,
        newQuestion: false
      })
    }
  }

  componentWillUnmount() {
    console.log("logging out of socket");
    this.leaveGame();
    this.socket.disconnect();
  }

  async leaveGame(){
    const url = "/api/leaveGame";
    let response;
    try {
      response = await fetch(url, {
        method: "delete"
      });

    } catch (err) {
      return;
    }
  }
}

export default requireAuth(Lobby);