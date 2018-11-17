import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { signup } from '../../actions';

class SignUp extends Component {
  onSubmit(values) {
    this.props.signup(values, () => {
      this.props.history.push('/lobby');
    });
  };

  render() {
    const { handleSubmit } = this.props;
    console.log(this.props.authenticated);

    return (
      <div>
        <h2>Enter credentials to Sign Up</h2>
        <br/>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <fieldset>
            <label>Email</label>
            <Field
              name="username"
              type="text"
              component="input"
              autoComplete="none"
            />
          </fieldset>
          <br/>
          <fieldset>
            <label>Password</label>
            <Field
              name="password"
              type="password"
              component="input"
              autoComplete="none"
            />
          </fieldset>
          <br/>
          <button className="btn">Sign Up!</button>
        </form>
        <h4>{this.props.errorMessage}</h4>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(mapStateToProps, {signup}),
  reduxForm({ form: 'signup' })
)(SignUp);
