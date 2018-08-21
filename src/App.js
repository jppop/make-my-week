import React, { Component } from "react";
import "./App.css";
import TimeGrid from './components/TimeGrid';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TimeGrid start={8} y={19}/>
      </div>
    );
  }
}

export default App;
