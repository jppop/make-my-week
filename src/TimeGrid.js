import React, { Component } from "react";
import PropTypes from "prop-types";

const styles = {
  container: {
    position: "relative",
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12
  },
  legend: {
    position: "absolute",
    color: "grey"
  },
  tickLine: {
    position: "absolute",
    borderLeft: "1px solid grey",
    height: 8
  },
  bar: {
    position: "absolute",
    border: "1px solid darkgrey"
  }
};

function Tick(props) {
  const tickStyle = {
    ...styles.legend,
    left: props.x,
    top: props.y
  };
  return (
    <div style={tickStyle}>
      <span>{props.tick.toString().padStart(2, "0") + ":00"}</span>
    </div>
  );
}

function Ticks(props) {
  let ticks = [];
  for (let tick = props.start; tick < props.end; tick++) {
    ticks.push(
      <Tick
        key={"tick-" + tick.toString()}
        tick={tick}
        x={props.x + (tick - props.start) * props.tickLength}
        y={props.y}
      />
    );
  }
  return ticks;
}

function TickLines(props) {
  let ticks = [];
  for (let tick = props.start; tick < props.end; tick++) {
    ticks.push(
      <TickLine
        key={"tickline-" + tick.toString()}
        x={15 + props.x + (tick - props.start) * props.tickLength}
        y={props.y}
      />
    );
  }
  return ticks;
}

function TickLine(props) {
  const tickLineStyle = {
    ...styles.tickLine,
    left: props.x,
    top: props.y
  };
  return <div style={tickLineStyle} />;
}

function EmptyBars(props) {
  let bars = [];
  for (let tick = props.start; tick < props.end + 1; tick++) {
    bars.push(
      <EmptyBar
        key={"emptybar-" + tick.toString()}
        x={15 + props.x + (tick - props.start) * props.tickLength}
        y={props.y}
        width={props.tickLength}
      />
    );
  }
  return bars;
}

function EmptyBar(props) {
  const barStyle = {
    ...styles.bar,
    left: props.x,
    top: props.y,
    height: "auto",
    width: props.width
  };
  return <div style={barStyle}>&nbsp;</div>;
}

export default class TimeGrid extends Component {
  static defaultProps = {
    start: 8,
    end: 19,
    x: 0,
    y: 0,
    tickLength: 60
  };
  static propTypes = {
    start: PropTypes.number,
    end: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    tickLength: PropTypes.number
  };

  render() {
    return (
      <div style={styles.container}>
        <div>
          <Ticks
            start={this.props.start}
            end={this.props.end}
            x={this.props.x + this.props.tickLength}
            y={this.props.y}
            tickLength={this.props.tickLength}
          />
        </div>
        <div>
          <TickLines
            start={this.props.start}
            end={this.props.end}
            x={this.props.x + this.props.tickLength}
            y={this.props.y + 18}
            tickLength={this.props.tickLength}
          />
        </div>
        <div>
          <EmptyBars
            start={this.props.start}
            end={this.props.end}
            x={this.props.x}
            y={this.props.y + 36 - 8}
            tickLength={this.props.tickLength}
          />
        </div>
      </div>
    );
  }
}
