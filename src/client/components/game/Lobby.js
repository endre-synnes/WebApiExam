import React, {Component} from "react";
import requireAuth from "./../requireAuth";

class Lobby extends Component {
  render() {
    return <div>Start a new game</div>
  }
}

export default requireAuth(Lobby);