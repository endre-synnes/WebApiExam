import React, { Component } from "react";
import requireAuth from "./../requireAuth";

class LeaderBoard extends Component {
  render() {
    return (
      <div>
        <h2>Top 10 players</h2>
        <ul>
          <li>mee</li>
          <li>mee</li>
          <li>mee</li>
          <li>mee</li>
        </ul>
      </div>
    )
  }
}

export default requireAuth(LeaderBoard);