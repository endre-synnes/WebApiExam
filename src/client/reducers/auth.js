import { AUTH_USER, AUTH_ERROR, WS_TOKEN } from '../actions/authStatusTypes';

const INITIAL_STATE = {
  authenticated: '',
  errorMessage: '',
  wstoken: ''
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      return { authenticated: action.payload };
    case AUTH_ERROR:
      return { errorMessage: action.payload };
    case WS_TOKEN:
      return { wstoken: action.payload };
    default:
      return state;
  }
}
