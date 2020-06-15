import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
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
} from "recharts";
import ReactTable from "react-table";
import "react-table/react-table.css";
const controller = new AbortController();
const signal = controller.signal;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
      activeSessions: [],
    };
  }
  componentDidMount() {
    this.intervalIdPerf = this.fetchAndSet();
    this.intervalIdActiveSessions = this.fetchActiveSessions();
  }
  componentWillUnmount() {
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
        <div id="wrapper">
          <h1>helloReact!</h1>
          <Link to="/next-page">next-page</Link>
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
                    // style: { whiteSpace: "unset" },
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
          {/* <p>activeSessions: {JSON.stringify(this.state.activeSessions)}</p> */}
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
        <LineChart width={500} height={200} data={this.state.chartDataArray}>
          <XAxis dataKey="time"></XAxis>
          <YAxis />
          <Line dataKey="value" />
        </LineChart>
      </div>
    );
  }
}
function NextPage() {
  return <h1>nextPage</h1>;
}
export default App;
