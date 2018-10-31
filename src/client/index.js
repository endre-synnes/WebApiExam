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
import SignOut from "./components/auth/SignOut";
import NewGame from "./components/game/NewGame";

const store = createStore(
  reducers,
  {
    auth: { authenticated: localStorage.getItem('username') }
  },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route path="/" exact component={Welcome}/>
        <Route path="/signup" exact component={SignUp}/>
        <Route path="/signout" exact component={SignOut}/>
        <Route path="/new-game" exact component={NewGame}/>
      </App>
    </BrowserRouter>
  </Provider>
  ,document.querySelector("#root")
);

