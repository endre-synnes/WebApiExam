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
import SignIn from "./components/auth/SignIn";
import SignOut from "./components/auth/SignOut";
import Lobby from "./components/game/Lobby";
import LeaderBoard from "./components/game/LeaderBoard";
import About from "./components/About";

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
        <Route path="/signin" exact component={SignIn}/>
        <Route path="/signout" exact component={SignOut}/>
        <Route path="/lobby" exact component={Lobby}/>
        <Route path="/leaderboard" exact component={LeaderBoard}/>
        <Route path="/about" exact component={About}/>
      </App>
    </BrowserRouter>
  </Provider>
  ,document.querySelector("#root")
);

