import axios from 'axios';
import { AUTH_USER, AUTH_ERROR } from './authStatusTypes';

export const signup = (values, callback) => async dispatch => {
  console.log("values from form");
  console.log(values);
  try {
    const response = await axios.post(
      '/api/signup',
      values
    );

    console.log("response status:");
    console.log(response.status);


    if (response.status === 204) {
      dispatch({ type: AUTH_USER, payload: values.userId });
      localStorage.setItem('userId', response.data.userId);
      callback();
    } else {
      dispatch({ type: AUTH_ERROR, payload: 'Error while creating user' });
    }

  } catch (e) {
    dispatch({ type: AUTH_ERROR, payload: 'Email in use' });
  }
};