import React from "react";
import "../node_modules/gestalt/dist/gestalt.css";
import "./connect.css";
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
// import { ConnectionError } from "mssql";

class Connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // server: "",
      // user: "",
      // password: "",
      isConnected: false,
      isFailed: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    let configInfo = {
      server: e.target.server.value,
      port: parseInt(e.target.port.value),
      user: e.target.user.value,
      password: e.target.password.value,
    };
    // this.setState(configInfo);
    fetch("/connect-config", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(configInfo),
    })
      .then((result) => result.text())
      .then((connResult) => {
        console.log(connResult);
        if (connResult === "CONNECTED") {
          this.props.setServer();
          this.props.history.push("/dashboard");
        } else {
          this.setState({ isFailed: true });
        }
      });
  }
  render() {
    return (
      <div id="connect-container">
        <h1>Set connection Info</h1>
        <Box maxWidth={300}>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="server"
              onChange={() => {}}
              type="text"
              placeholder="server"
            />
            <TextField
              id="port"
              onChange={() => {}}
              type="number"
              placeholder="port"
            />
            <TextField
              id="user"
              onChange={() => {}}
              type="text"
              placeholder="user"
            />
            <TextField
              id="password"
              onChange={() => {}}
              type="password"
              placeholder="password"
            />
            <Button color="red" type="submit" text="Connect" />
            {this.state.isFailed ? (
              <p id="connect-error">connection FAILED</p>
            ) : null}
          </form>
        </Box>
      </div>
    );
  }
}

export default withRouter(Connect);
