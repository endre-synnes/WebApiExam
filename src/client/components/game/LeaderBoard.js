import React, { Component } from "react";
import requireAuth from "./../requireAuth";

class LeaderBoard extends Component {


  constructor(props){
    super(props);

    this.state = {
      leaders: null
    }
  }

  componentDidMount(){
    this.getLeaders = this.getLeaders.bind(this)

    this.getLeaders();
  }

  async getLeaders(){
    const url = "/api/leaderboard";
    let response;
    try {
      response = await fetch(url, {
        method: "get"
      });
    } catch (err) {
      this.setState({errorMsg: "Failed to connect to server: " + err});
      return;
    }

    let payload = await response.json();

    if (payload){
      this.setState({leaders: payload})
    }
  }

  render() {
    if (this.state.leaders) {
      const listItems = this.state.leaders.users.map((d) => <li key={d.username}>{d.username}  {d.wins}</li>);
      return(
        <div>
          {listItems}
        </div>
      )
    } else {
      return (
        <div>
          <h2>No leaders</h2>
        </div>
      )
    }
  }
}
export default requireAuth(LeaderBoard);