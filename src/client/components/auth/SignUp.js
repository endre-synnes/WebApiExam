import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { signup } from '../../actions';

class SignUp extends Component {
  onSubmit(values) {
    this.props.signup(values, () => {
      this.props.history.push('/');
    });
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <fieldset>
          <label>Email</label>
          <Field
            name="userId"
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
        <button>Sign Up!</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  console.log(state.auth);
  return {
    authenticated: state.auth,
    errorMessage: state.auth.errorMessage
  };
}

export default compose(
  connect(mapStateToProps, {signup}),
  reduxForm({ form: 'signup' })
)(SignUp);
