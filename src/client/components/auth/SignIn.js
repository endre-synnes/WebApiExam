import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { signin } from '../../actions';

class SignIn extends Component {
  onSubmit(values) {
    this.props.signin(values, () => {
      this.props.history.push('/lobby');
    });
  };

  render() {
    const { handleSubmit } = this.props;
    console.log(this.props.authenticated);

    return (
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
        <fieldset>
          <label>Password</label>
          <Field
            name="password"
            type="password"
            component="input"
            autoComplete="none"
          />
        </fieldset>
        <div>{this.props.errorMessage}</div>
        <button>Sign In!</button>
      </form>
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
  connect(mapStateToProps, {signin}),
  reduxForm({ form: 'signin' })
)(SignIn);
