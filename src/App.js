import React from 'react';
import './App.css';
import {
	BarChart
	,Bar
	,Line
	,LineChart
	,XAxis
	,YAxis
	,Tooltip
} from 'recharts';
import ReactTable from "react-table";
import "react-table/react-table.css";
const controller = new AbortController();
const signal = controller.signal;

class App extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
		memPCT: []
		,activeSessions: []
  	}
  }
  componentDidMount() {
	this.intervalIdPerf = this.fetchAndSet();
	this.intervalIdActiveSessions = this.fetchActiveSessions();
	console.log(this.intervalIdPerf, this.intervalIdActiveSessions)
	}
	componentWillUnmount() {
		clearInterval(this.intervalIdPerf);
		clearInterval(this.intervalIdActiveSessions);
	}
	fetchAndSet() {
		return setInterval(() => {
			fetch('/test', { signal })
				.then(res => {
					return res.json()
				}).then(resObj => {
					this.setState((state) => {
						if (state.memPCT.length < 5) {
							return {memPCT: [...state.memPCT, resObj]}
						} else {
							return {memPCT: [...state.memPCT.slice(state.memPCT.length - 4), resObj]}
						}
					})
				}).catch(err => {
					if (err.name === 'AbortError') {
					  console.log('Fetch aborted');
					} else {
					  console.error('Uh oh, an error!', err);
					}
				});
		}, 1000);
	}
	fetchActiveSessions() {
		return setInterval(() => {
			fetch('/active-sessions', { signal })
				.then(res => {
					return res.json()
				}).then(resObj => {
					this.setState((state) => {
						return {activeSessions: resObj}
					})
				}).catch(err => {
					if (err.name === 'AbortError') {
					  console.log('Fetch aborted');
					} else {
					  console.error('Uh oh, an error!', err);
					}
				});
		}, 1000);
	}
  render() {
    return (
      <div id="wrapper">
	      <h1>helloReact!</h1>
		  <LineChart width={500} height={300} data={this.state.memPCT}>
			<XAxis dataKey="name" />
			<YAxis />
			<Line dataKey="value" />
		  </LineChart>
		  
		  <ReactTable
				data={this.state.activeSessions}
				columns={[
					{
					columns: [
						{Header: "SPID", accessor: "SPID"}
						,{Header: "STATUS", accessor: "STATUS"}
						,{Header: "DB_NAME", accessor: "DB_NAME"}
						,{Header: "LOGINAME", accessor: "LOGINAME"}
						,{Header: "HOSTNAME", accessor: "HOSTNAME"}
						,{Header: "BLOCKED", accessor: "BLOCKED"}
						,{Header: "Q.TEXT", accessor: "Q.TEXT"}
						,{Header: "CMD", accessor: "CMD"}
						,{Header: "CPU", accessor: "CPU"}
						,{Header: "PHYSICAL_IO", accessor: "PHYSICAL_IO"}
						,{Header: "LAST_BATCH", accessor: "LAST_BATCH"}
						,{Header: "PROGRAM_NAME", accessor: "PROGRAM_NAME"}
					]
					}
				]}
				defaultPageSize={20}
				style={{
					height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
				}}
				className="-striped -highlight"
       	  />
		  <p>activeSessions: {JSON.stringify(this.state.activeSessions)}</p>

	  </div>
    );
  }
}

export default App;
