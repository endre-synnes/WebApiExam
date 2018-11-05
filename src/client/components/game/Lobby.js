import React, {Component} from "react";
import requireAuth from "./../requireAuth";
import { connect } from 'react-redux';
import {getWsToken} from "../../actions"

//import BoardState from "../../../shared/GameState";

class Lobby extends Component {

  componentDidMount() {
    this.logInWithWebToken();
  }


  render() {
    return (
      <div>Start a new game token: {localStorage.getItem('wstoken')}</div>
    );
  };


  logInWithWebToken(){
    const token = this.props.getWsToken();

  }
}

function mapStateToProps(state) {
  return {
    wstoken: state.auth.wstoken,
    errorMessage: state.auth.errorMessage
  };
}

export default connect(mapStateToProps, {getWsToken})(requireAuth(Lobby));