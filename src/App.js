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
const controller = new AbortController();
const signal = controller.signal;

class App extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
		memPCT: []
		,activeSessions: ""
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
		  <p>activeSessions: {JSON.stringify(this.state.activeSessions)}</p>

	  </div>
    );
  }
}

export default App;
