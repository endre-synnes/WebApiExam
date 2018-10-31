import React, {Component} from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import {Nav, Navbar, NavItem} from "react-bootstrap";

class Header extends Component {
  renderLinks() {
    if(this.props.authenticated){
      return(
        <Nav>
          <NavItem eventKey={1}>
            <Link to={"/lobby"} style={{ textDecoration: 'none'}}>Lobby</Link>
          </NavItem>
          <NavItem eventKey={2}>
            <Link to={"/leaderboard"} style={{ textDecoration: 'none'}}>Leaderboard</Link>
          </NavItem>
        </Nav>
      )

    }



    // if (this.props.authenticated) {
    //   return (
    //     <div className="p-3 mb-2 bg-secondary">
    //       <Link to="/" className="btn btn-primary">Home</Link>
    //       <Link to="/lobby" className="btn btn-primary">Lobby</Link>
    //       <Link to="/signout" className="btn btn-danger">Sign Out</Link>
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div className="p-3 mb-2 bg-secondary">
    //       <Link to="/" className="btn btn-primary">Home</Link>
    //       <Link to="/signup" className="btn btn-primary">Sign Up</Link>
    //       <Link to="/signin" className="btn btn-primary">Sign In</Link>
    //     </div>
    //   );
    // }
  }

  renderAuthNav(){
    if(this.props.authenticated){
      return (
        <Nav pullRight>
          <NavItem eventKey={3} href="#">
            <Link to={"/signout"} style={{ textDecoration: 'none' }}>Sign out</Link>
          </NavItem>
        </Nav>
      )
    } else {
      return (
        <Nav pullRight>
          <NavItem eventKey={3}>
            <Link to={"/signup"} style={{ textDecoration: 'none' }}>Sign up</Link>
          </NavItem>
          <NavItem eventKey={4} href="#">
            <Link to={"/signin"} style={{ textDecoration: 'none' }}>Sign in</Link>
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
              <Link to="/">Quiz Game</Link>
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

export default connect(mapStateToProps)(Header);