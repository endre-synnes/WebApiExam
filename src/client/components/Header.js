import React, {Component} from "react";
import {Link, NavLink} from "react-router-dom";
import { connect } from 'react-redux';
import {Nav, Navbar, NavItem} from "react-bootstrap";
import requireAuth from "./requireAuth";

class Header extends Component {
  renderLinks() {
    if(this.props.authenticated){
      return(
        <Nav>
          <NavItem componentClass={Link} href="/lobby" to="/lobby">Game lobby</NavItem>
          <NavItem componentClass={Link} href="/leaderboard" to="/leaderboard">Leaderboard</NavItem>
        </Nav>
      )

    }
  }

  renderAuthNav(){
    if(this.props.authenticated){
      return (
        <Nav pullRight>
          <NavItem componentClass={Link} href="/signout" to="/signout">Sign out</NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav pullRight>
          <NavItem componentClass={Link} href="/signup" to="/signup">Sign up</NavItem>
          <NavItem componentClass={Link} href="/signin" to="/signin">Sign in</NavItem>
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
              <NavLink href="/" to="/">Quiz Game</NavLink>
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