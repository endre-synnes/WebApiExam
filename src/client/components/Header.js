import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import {Nav, Navbar, NavItem} from "react-bootstrap";
import requireAuth from "./requireAuth";

class Header extends Component {
  renderLinks() {
    if(this.props.authenticated){
      return(
        <Nav>
          <NavItem eventKey={1}>
            <NavLink to={"/lobby"} style={{ textDecoration: 'none'}}>Lobby</NavLink>
          </NavItem>
          <NavItem eventKey={2}>
            <NavLink to={"/leaderboard"} style={{ textDecoration: 'none'}}>Leaderboard</NavLink>
          </NavItem>
        </Nav>
      )

    }
  }

  renderAuthNav(){
    if(this.props.authenticated){
      return (
        <Nav pullRight>
          <NavItem eventKey={3} href="#">
            <NavLink to={"/signout"} style={{ textDecoration: 'none' }}>Sign out</NavLink>
          </NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav pullRight>
          <NavItem eventKey={3}>
            <NavLink to={"/signup"} style={{ textDecoration: 'none' }}>Sign up</NavLink>
          </NavItem>
          <NavItem eventKey={4} href="#">
            <NavLink to={"/signin"} style={{ textDecoration: 'none' }}>Sign in</NavLink>
          </NavItem>
        </Nav>
      )
    }
  }

  render() {
    return (
      <div>
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <NavLink to="/">Quiz Game</NavLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            {this.renderLinks()}
            {this.renderAuthNav()}
          </Navbar.Collapse>
        </Navbar>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}
export default connect(mapStateToProps)(requireAuth(Header));