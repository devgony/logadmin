import React from "react";
import "../node_modules/gestalt/dist/gestalt.css";
import "./login.css";
import {
  Avatar,
  Box,
  Button,
  Card,
  Heading,
  Link,
  Text,
  TextField,
} from "gestalt";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      password: "",
      haveFailed: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (e.target.name.value === "admin" && e.target.password.value === "1") {
      this.props.makeLongin();
      this.props.history.push("/connect");
    } else {
      this.setState({ haveFailed: true });
    }
  }
  render() {
    // const { match, location, history } = this.props;
    // console.log("++++", match, location, history);
    return (
      <div id="login-container">
        <Box maxWidth={200}>
          <h1 id="app-name">Logadmin</h1>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="name"
              onChange={() => {}}
              type="text"
              placeholder="name"
            />
            <TextField
              id="password"
              onChange={() => {}}
              type="password"
              placeholder="password"
            />
            <Button color="red" type="submit" text="Login" />
            {this.state.haveFailed ? (
              <p id="login-error">invalid user/password</p>
            ) : null}
          </form>
        </Box>
      </div>
    );
  }
}

export default withRouter(Login);
