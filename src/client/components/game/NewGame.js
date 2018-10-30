import React, {Component} from "react";
import requireAuth from "./../requireAuth";

class NewGame extends Component {
  render() {
    return <div>Start a new game</div>
  }
}

export default requireAuth(NewGame);