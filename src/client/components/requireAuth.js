import React, { Component } from 'react';
import { connect } from 'react-redux';
import {isAuthenticated} from '../actions';
import { withRouter } from "react-router-dom";

/*
    INFO:
    This file is inspired by The Udemy course: Advanced React and Redux: 2018 Edition (Made by Stephen Grider)
 */

export default ChildComponent => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      this.props.isAuthenticated( () => {
        if (!this.props.auth) {
          this.props.history.push('/');
        }
      });
    }

    render() {
      return <ChildComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth.authenticated };
  }
  return connect(mapStateToProps, {isAuthenticated})(withRouter(ComposedComponent));
};
