import axios from 'axios';
import { AUTH_USER, AUTH_ERROR } from './authStatusTypes';

export const signup = (values, callback) => async dispatch => {
  try {

    const response = await axios.post(
      '/api/signup',
      values
    );

    if (response.status !== 204) {
      dispatch({ type: AUTH_ERROR, payload: "Error while creating user, status code: "+response.status });
    }

    dispatch({ type: AUTH_USER, payload: values.userId });
    localStorage.setItem('userId', values.userId);
    callback();

  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
  }
};


export const signout = (values, callback) => async dispatch => {

  try {
    const response = await axios.post(
      '/api/logout'
    );

    dispatch({ type: AUTH_USER, payload: null });
    localStorage.removeItem('userId');
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