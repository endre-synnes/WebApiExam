import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signout } from '../../actions';

class SignOut extends Component {
  componentDidMount() {
    this.props.signout(null, () => {
      this.props.history.push('/');
    });
  }

  render() {
    return <div>Sorry to see you go</div>;
  }
}

export default connect(null, {signout})(SignOut);