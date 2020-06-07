import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { LineChart, Line } from 'recharts';
const os = require('os-utils');
var cpuPercent;
os.cpuUsage((c) => {
	console.log(c);
	cpuPercent = c;
})

const data = [
	{name: 'Page A', uv: 400, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 600, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 300, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 200, pv: 2400, amt: 2400}
	,{name: 'Page B', uv: 100, pv: 2400, amt: 2400}
];
console.log("cpu", cpuPercent)
class App extends React.Component {
  constructor(props) {
  	super(props);
  	this.state = {
  		cpu: cpuPercent
  	}
  }
  render() {
    return (
      <div id="wrapper">
	      <h1>helloReact!</h1>
		  <LineChart width={400} height={400} data={data}>
		    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
		  </LineChart>
		  <h1>CPU: {this.state.cpu}</h1>
	  </div>
    );
  }
}

export default App;
