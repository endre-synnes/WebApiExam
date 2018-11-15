import React, { Component } from "react";
import requireAuth from "./../requireAuth";
var ReactBsTable  = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

class LeaderBoard extends Component {


  constructor(props){
    super(props);

    this.state = {
      leaders: null,
      errorMsg: null
    }
  }

  componentDidMount(){
    this.getLeaders = this.getLeaders.bind(this);
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
      return(
        <div>
          <BootstrapTable data={this.state.leaders.users} striped hover>
            <TableHeaderColumn isKey dataField='username'>Username</TableHeaderColumn>
            <TableHeaderColumn dataField='wins'>Number of wins</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    } else {
      return (
        <div>
          <h2>No leaders</h2>
          <h5>{this.state.errorMsg}</h5>
        </div>
      )
    }
  }
}
export default requireAuth(LeaderBoard);