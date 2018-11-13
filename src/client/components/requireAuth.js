import React, { Component } from 'react';
import { connect } from 'react-redux';
import {isAuthenticated} from '../actions';
import { withRouter } from "react-router-dom";

export default ChildComponent => {
  class ComposedComponent extends Component {
    // Our component just got rendered
    componentDidMount() {
      this.shouldNavigateAway();
    }

    // Our component just got updated
    componentDidUpdate() {
      this.shouldNavigateAway();
    }



    shouldNavigateAway() {
      // this.props.isAuthenticated(() => {
      //   console.log("in callback");
      //   console.log(this.props.auth);
      //   if (!this.props.auth) {
      //     console.log(this.props.auth);
      //     this.props.history.push('/');
      //   }
      // });

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
