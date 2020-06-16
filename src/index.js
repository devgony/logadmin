import React from "react";
import ReactDOM from "react-dom";
// import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import "./index.css";
import App from "./App";
import Login from "./Login";
import Connect from "./Connect";
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Redirect,
} from "react-router-dom";

class Routers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogined: false,
      isConnected: false,
    };
    this.makeLongin = this.makeLongin.bind(this);
    this.setServer = this.setServer.bind(this);
  }
  makeLongin() {
    this.setState((state) => ({
      isLogined: true,
    }));
  }
  setServer() {
    this.setState({ isConnected: true });
  }
  render() {
    return (
      <div id="index-container">
        <Router>
          {this.state.isLogined ? (
            this.state.isConnected ? (
              <Route path="/dashboard" component={App} />
            ) : (
              <div>
                <Route
                  path="/connect"
                  render={(props) => (
                    <Connect
                      isConnected={this.state.isConnected}
                      setServer={this.setServer}
                    />
                  )}
                />
              </div>
            )
          ) : (
            <div>
              <Redirect exact from="/" to="/login" />
              <Route
                path="/login"
                render={(props) => (
                  <Login
                    isLogined={this.state.isLogined}
                    makeLongin={this.makeLongin}
                  />
                )}
              />
            </div>
          )}
        </Router>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>{<Routers />}</React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
