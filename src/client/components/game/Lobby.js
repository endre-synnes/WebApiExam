import React, {Component} from "react";
import requireAuth from "./../requireAuth";
import { connect } from 'react-redux';
import {getWsToken} from "../../actions"
import openSocket from 'socket.io-client';


//import BoardState from "../../../shared/GameState";

class Lobby extends Component {

  constructor(props){
    super(props);

    this.state = {
      gameId: null,
      gameState: null,
      players: null,
      errorMsg: null,
      isOrganizer: false
    };
  }


  componentDidMount() {



    this.startNewGame = this.startNewGame.bind(this);
    this.makeGuess = this.makeGuess.bind(this);

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

      console.log("data from update:");
      console.log(data);

      this.setState({
        gameId: data.gameId,
        gameState: data.gameState,
        players: data.players
      });

      this.socket.on('disconnect', () => {
        this.setState({errorMsg: "Disconnected from Server."});
      });



    });

    this.logInWithWebToken().then(
      this.startNewGame
    )
    // this.startNewGame().then(
    //   this.logInWithWebToken
    // );
  }

  async startNewGame(){

    console.log("calling /api/game");

    this.setState({
      gameId: null,
      gameState: null,
      players: null,
      errorMsg: null,
      isOrganizer: false
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
      //this could happen if the session has expired
      this.setState({errorMsg: "You should log in first"});
      return;
    }

    if (response.status !== 201 && response.status !== 204) {
      this.setState({errorMsg: "Error when connecting to server: status code " + response.status});
      return;
    }

    const payload = await response.json();

    console.log(payload);
    this.setState({isOrganizer: payload.isOrganizer});
  }

  async startGame(){
    const url = "/api/start";

    console.log("starting game");

    let response;

    try {
      response = await fetch(url, {
        method: "post"
      });
    } catch (err) {
      this.setState({errorMsg: "Failed to connect to server: " + err});
      return;
    }

    const payload = response.json();
    console.log("payload form start game");
    console.log(payload)

  }

  renderLoginBtn(){
    if (this.state.isOrganizer) {
      return <button onClick={this.startGame}>Start</button>
    }
  }

  render() {
    return (
      <div>
        <h4>Start a new game token: {localStorage.getItem('wstoken')}</h4>
        {this.renderLoginBtn()}
        {this.renderQuiz()}
      </div>
    );
  };


  renderQuiz(){

    if (this.state.gameState) {
      return <div>
        <p>{this.state.gameState.question}</p>
        <button onClick={this.makeGuess}>Make guess</button>
        </div>
    } else {
      return <p>Hit start</p>
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

      console.log("token before login on web socket:::");
      console.log(payload);

      this.socket.emit('login', payload);

    } catch (err) {
      this.setState({errorMsg: "Failed to connect to server: " + err});
      return;
    }


    this.props.getWsToken(() => {
      const token = localStorage.getItem('wstoken');



      if (token) {
      } else {
        console.log("could not provide ws token")
      }
    });
  }

  makeGuess(){
    if (this.state.gameState) {
      this.socket.emit('insertion', {
        questionId: this.state.gameState.questionId,
        answerIndex: 2,
        gameId: this.state.gameId
      });
    }
  }

  componentWillUnmount() {
    console.log("logging out of socket");
    this.socket.disconnect();
  }
}

function mapStateToProps(state) {
  return {
    wstoken: state.auth.wstoken,
    errorMessage: state.auth.errorMessage
  };
}

export default connect(mapStateToProps, {getWsToken})(requireAuth(Lobby));