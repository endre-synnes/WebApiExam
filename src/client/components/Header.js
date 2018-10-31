import React, {Component} from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';

class Header extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      return (
        <div className="p-3 mb-2 bg-secondary">
          <Link to="/" className="btn btn-primary">Home</Link>
          <Link to="/lobby" className="btn btn-primary">Lobby</Link>
          <Link to="/signout" className="btn btn-danger">Sign Out</Link>
        </div>
      );
    } else {
      return (
        <div className="p-3 mb-2 bg-secondary">
          <Link to="/" className="btn btn-primary">Home</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          <Link to="/signin" className="btn btn-primary">Sign In</Link>
        </div>
      );
    }
  }


  render() {
    return (
      <div>
        {this.renderLinks()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(Header);