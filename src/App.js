import React from 'react';
// import logo from './logo.svg';
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
// const os = require('os-utils');
// var cpuPercent;
// console.log(os.cpuCount())
// os.cpuUsage((c) => {
// 	console.log(c);
// 	cpuPercent = c;
// })

const data = [
	{name: 'Page A', uv: 400, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 600, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 300, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 200, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 100, pv: 2400, amt: 2400}
];
class App extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
		memPCT: []
  	}
  }
  componentDidMount() {
	setInterval(() => {
		fetch('/test')
			.then(res => {
				// console.log("val:", res.json());
				return res.json()
			}).then(memPercent => {
				// console.log(memPercent);
				this.setState((state) => {
					if (state.memPCT.length < 5) {
						return {memPCT: [...state.memPCT, memPercent]}
					} else {
						return {memPCT: [...state.memPCT.slice(state.memPCT.length - 4), memPercent]}
					}
				})
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
		  <h1>PageLookup: {JSON.stringify(this.state.memPCT)}</h1>
	  </div>
    );
  }
}

export default App;
