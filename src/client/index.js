import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import Welcome from "./components/Welcome";
import App from "./components/App";
import SignUp from './components/auth/SignUp';

const store = createStore(
  reducers,
  {
    auth: { authenticated: localStorage.getItem('userId') }
  },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={Welcome}/>
        <Route path="/signup" exact component={SignUp}/>
      </App>
    </BrowserRouter>
  </Provider>
  ,document.querySelector("#root")
);

