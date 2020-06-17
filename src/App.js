import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter,
  Prompt,
} from "react-router-dom";
import "./App.css";
import {
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ResponsiveContainer,
} from "recharts";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  Avatar,
  Box,
  Button,
  Card,
  Heading,
  Link as LinkStyle,
  Text,
  TextField,
  Tabs,
} from "gestalt";
const controller = new AbortController();
const signal = controller.signal;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      activeSessions: [],
      activeIndex: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange({ activeTabIndex, event }) {
    event.preventDefault();
    this.setState({ activeIndex: activeTabIndex });
  }
  componentDidMount() {
    this.intervalIdPerf = this.fetchAndSet();
    this.intervalIdActiveSessions = this.fetchActiveSessions();
  }
  componentWillUnmount() {
    console.log("unmounted!");
    fetch("/test", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify("umounted!"),
    });
    clearInterval(this.intervalIdPerf);
    clearInterval(this.intervalIdActiveSessions);
  }
  fetchActiveSessions() {
    return setInterval(() => {
      fetch("/active-sessions", { signal })
        .then((res) => {
          return res.json();
        })
        .then((resObj) => {
          this.setState((state) => {
            return { activeSessions: resObj };
          });
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            console.error("Uh oh, an error!", err);
          }
        });
    }, 2000);
  }
  fetchAndSet() {
    return setInterval(() => {
      fetch("/perf", { signal })
        .then((res) => {
          return res.json();
        })
        .then((resObj) => {
          this.setState((state) => {
            return { chartData: resObj };
          });
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            console.error("Uh oh, an error!", err);
          }
        });
    }, 2000);
  }
  render() {
    return (
      <Router>
        <Prompt message="You have unsaved changes, are you sure you want to leave?" />
        <div id="wrapper">
          <div id="logo-container">
            <h1>Logadmin</h1>
          </div>
          <div id="nav-container">
            <Tabs
              tabs={[
                {
                  text: "MAIN",
                  href: "main",
                },
                {
                  text: "CONNECT",
                  href: "connect",
                },
                {
                  text: "LOGOUT",
                  href: "login",
                },
              ]}
              activeTabIndex={this.state.activeIndex}
              onChange={this.handleChange}
              size="lg"
            />
          </div>
          <div id="chart-container">
            <RenderLineChart
              className="perf-chart"
              chartTitle="cpu_sql"
              chartData={this.state.chartData.cpu_sql}
            />
            <RenderLineChart
              className="perf-chart"
              chartTitle="page_lookups"
              chartData={this.state.chartData.page_lookups}
            />
            <RenderLineChart
              className="perf-chart"
              chartTitle="batch_requests"
              chartData={this.state.chartData.batch_requests}
            />
            <RenderLineChart
              className="perf-chart"
              chartTitle="page_reads"
              chartData={this.state.chartData.page_reads}
            />
            <RenderLineChart
              className="perf-chart"
              chartTitle="active_sessions"
              chartData={this.state.chartData.active_sessions}
            />
            <RenderLineChart
              className="perf-chart"
              chartTitle="locks"
              chartData={this.state.chartData.locks}
            />
          </div>
          <div id="table-container">
            <ReactTable
              data={this.state.activeSessions}
              columns={[
                {
                  columns: [
                    {
                      Header: "SPID",
                      accessor: "SPID",
                      // headerStyle: {
                      //   background: "blue",
                      //   textAlign: "center",
                      //   color: "darkorange",
                      //   borderRadius: "5px",
                      //   padding: "5px",
                      //   border: "1px solid black",
                      //   borderRight: "3px solid yellow",
                      //   borderLeft: "3px solid yellow",
                      //   borderTop: "3px solid yellow",
                      //   borderBottom: "3px solid yellow",
                      // },
                    },
                    { Header: "STATUS", accessor: "STATUS" },
                    { Header: "DB_NAME", accessor: "DB_NAME" },
                    { Header: "LOGINAME", accessor: "LOGINAME" },
                    { Header: "HOSTNAME", accessor: "HOSTNAME" },
                    { Header: "BLOCKED", accessor: "BLOCKED" },
                    {
                      Header: "TEXT",
                      accessor: "TEXT",
                    },
                    { Header: "CMD", accessor: "CMD" },
                    { Header: "CPU", accessor: "CPU" },
                    { Header: "PHYSICAL_IO", accessor: "PHYSICAL_IO" },
                    { Header: "LAST_BATCH", accessor: "LAST_BATCH" },
                    { Header: "PROGRAM_NAME", accessor: "PROGRAM_NAME" },
                  ],
                },
              ]}
              defaultPageSize={20}
              style={{
                height: "300px", // This will force the table body to overflow and scroll, since there is not enough room
              }}
              className="-striped -highlight"
            />
          </div>
          <Switch>
            <Route path="/next-page">
              <NextPage />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

class RenderLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartDataArray: [],
    };
  }
  componentDidUpdate(nextProps) {
    const { chartData } = this.props;
    if (nextProps.chartData !== chartData) {
      if (chartData) {
        this.setState((state) => {
          if (state.chartDataArray.length < 5) {
            return {
              chartDataArray: [...state.chartDataArray, this.props.chartData],
            };
          } else {
            return {
              chartDataArray: [
                ...state.chartDataArray.slice(state.chartDataArray.length - 4),
                this.props.chartData,
              ],
            };
          }
        });
      }
    }
  }
  render() {
    return (
      <div>
        <h2>{this.props.chartTitle}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart width={500} height={200} data={this.state.chartDataArray}>
            <XAxis dataKey="time"></XAxis>
            <YAxis />
            <Line dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
function NextPage() {
  return <h1>nextPage</h1>;
}
export default withRouter(App);
