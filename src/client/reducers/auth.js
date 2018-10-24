import { AUTH_USER, AUTH_ERROR } from '../actions/authStatusTypes';

const INITIAL_STATE = {
  authenticated: '',
  errorMessage: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return action.payload ;
    case AUTH_ERROR:
      return action.payload ;
    default:
      return state;
  }
}
