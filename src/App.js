import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Bar from "./Bar";
import TimeGrid from './TimeGrid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TimeGrid x={10} y={40}/>
        <div style={{ position: "relative" }}>
          <Bar x={5} width={200} color="blue" text="04:00" />
          <Bar x={210} width={200} color="red" text="02:00" />
          <Bar x={24} y={40 + 36 - 6} width={60} color="blue" text="01:00" />
          <Bar x={138} y={40 + 36 - 6} width={121} color="red" text="02:00" />
         </div>
      </div>
    );
  }
}

export default App;
