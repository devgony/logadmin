import React from "react";
import ReactDOM from "react-dom";
// import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import "./index.css";
import App from "./App";
import Login from "./Login";
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Redirect,
} from "react-router-dom";

// function pushHistory() {
//   let history = useHistory();
//   history.push("/dashboard")
//   return history
// }

class Routers extends React.Component {
  // static propTypes = {
  //   match: PropTypes.object.isRequired,
  //   location: PropTypes.object.isRequired,
  //   history: PropTypes.object.isRequired,
  // };
  constructor(props) {
    super(props);
    this.state = {
      isLogined: false,
    };
    this.makeLongin = this.makeLongin.bind(this);
  }
  makeLongin() {
    this.setState((state) => ({
      isLogined: true,
    }));
  }
  render() {
    // const { match, location, history } = this.props;
    // console.log("++++", match, location, history);
    return (
      <div>
        <Router>
          {this.state.isLogined ? (
            <Route path="/dashboard" component={App} />
          ) : (
            <div>
              <Redirect exact from="/" to="/login" />
              <Route
                path="/login"
                render={(props) => (
                  <Login
                    isLogined={this.state.isLogined}
                    makeLongin={this.makeLongin}
                    // location="/login"
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
// const ShowRouters = withRouter(Routers);

ReactDOM.render(
  <React.StrictMode>{<Routers location="/home" />}</React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
