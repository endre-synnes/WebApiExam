import React, {Component} from "react";
import requireAuth from "./../requireAuth";
import { connect } from 'react-redux';
import {getWsToken} from "../../actions"
import openSocket from 'socket.io-client';


//import BoardState from "../../../shared/GameState";

class Lobby extends Component {


  componentDidMount() {

    this.state = {
      gameId: null,
      gameState: null,
      players: null,
      errorMsg: null
    };

    this.startNewGame = this.startNewGame.bind(this);


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
        gameId: data.gameId,
        gameState: data.gameState,
        players: data.players
      });

      this.socket.on('disconnect', () => {
        this.setState({errorMsg: "Disconnected from Server."});
      });



    });

    this.startNewGame().then(
      this.logInWithWebToken
    );
  }

  async startNewGame(){
    /*
            When we try to start a new match, the current one (if any)
            should be deleted.
         */
    this.setState({
      gameId: null,
      gameState: null,
      players: null,
      errorMsg: null
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

    console.log(response)
  }

  render() {
    return (
      <div>
        <h4>Start a new game token: {localStorage.getItem('wstoken')}</h4>
        <button onClick={this.startGame}>Start</button>
      </div>
    );
  };


  async logInWithWebToken(){
    this.props.getWsToken();
    const token = localStorage.getItem('wstoken');

    console.log("token before login on web socket:::");
    console.log(token);

    if (token) {
      this.socket.emit('login', token);
    } else {
      console.log("could not provide ws token")
    }


  }

  componentWillUnmount() {
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