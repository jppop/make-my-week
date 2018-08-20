import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import Bar from "./Bar";
import TimeGrid from './TimeGrid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div style={{ position: "relative" }}>
          <Bar x={5} width={200} color="blue" text="04:00" />
          <Bar x={210} width={200} color="red" text="02:00" />
        </div>
        <TimeGrid x={10} y={40}/>
      </div>
    );
  }
}

export default App;
