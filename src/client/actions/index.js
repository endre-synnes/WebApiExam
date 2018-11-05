import axios from 'axios';
import { AUTH_USER, AUTH_ERROR, WS_TOKEN} from './authStatusTypes';

export const signup = (values, callback) => async dispatch => {
  try {

    const response = await axios.post(
      '/api/signup',
      values
    );

    if (response.status !== 204) {
      dispatch({ type: AUTH_ERROR, payload: "Error while creating user, status code: "+response.status });
    }

    dispatch({ type: AUTH_USER, payload: values.username });
    localStorage.setItem('username', values.username);
    callback();

  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Error while creating user" });
  }
};

export const signin = (values, callback) => async dispatch => {
  try {

    const response = await axios.post(
      '/api/login',
      values
    );

    // if (response.status !== 204) {
    //   dispatch({ type: AUTH_ERROR, payload: "Error while creating user, status code: "+response.status });
    // }
    console.log(response.data);

    dispatch({ type: AUTH_USER, payload: response.data.username });
    localStorage.setItem('username', response.data.username);
    callback();

  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Error while creating user" });
  }
};


export const signout = (values, callback) => async dispatch => {

  try {
    const response = await axios.post(
      '/api/logout'
    );

    dispatch({ type: AUTH_USER, payload: null });
    localStorage.removeItem('username');
    callback();

    return {
      type: AUTH_USER,
      payload: ''
    };

  } catch (e) {

    dispatch({ type: AUTH_ERROR, payload: 'Error while logging out' });

    return {
      type: AUTH_ERROR,
      payload: 'Error while logging out'
    };
  }
};

export const isAuthenticated = (values, callback) => async dispatch => {
  try {
    const response = await axios.get(
      '/api/user'
    );

    await dispatch({ type: AUTH_USER, payload: response.data.username });
    localStorage.setItem('username', response.data.username);
    callback();

  } catch (e) {
    console.log("error while getting is authenticated");
    localStorage.removeItem('username');
    await dispatch({ type: AUTH_ERROR, payload: 'User Not Authenticated' });
    callback();

    return {
      type: AUTH_ERROR,
      payload: 'User Not Authenticated'
    };
  }
};

export const getWsToken = (callback) => async dispatch => {
  try {

    const response = await axios.post(
      'api/wstoken'
    );

    // if (response.status !== 204) {
    //   dispatch({ type: AUTH_ERROR, payload: "Error while creating user, status code: "+response.status });
    // }

    dispatch({ type: WS_TOKEN, payload: response.data.wstoken });
    localStorage.setItem('wstoken', response.data.wstoken);

    //callback();
    return response.data.wstoken;

  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: "Error while getting ws token" });
  }
};
