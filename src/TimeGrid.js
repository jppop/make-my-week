import React, { Component } from "react";
import PropTypes from "prop-types";
i
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
    borderRight: "1px solid darkgrey"
  },
  grid: {
    display: "table",
    position: "absolute",
    borderSpacing: 1,
    backgroundColor: "darkgray",
    border: "1px solid darkgray"
  },

  gridRow: {
    display: "table-row"
  },
  gridCell: {
    display: "table-cell",
    backgroundColor: "white",
    width: 60,
    height: "auto"
  }
};

function Ticks(props) {
  let ticks = [];
  for (let tick = props.start; tick < props.end; tick++) {
    ticks.push(
      <Tick
        key={"tick-" + tick.toString()}
        tick={tick}
        x={props.x + ((tick - props.start) * (props.tickLength + 1))}
        y={props.y}
      />
    );
  }
  return ticks;
}

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

function TickLines(props) {
  let ticks = [];
  for (let tick = props.start; tick < props.end; tick++) {
    ticks.push(
      <TickLine
        key={"tickline-" + tick.toString()}
        x={props.x + (tick - props.start) * (props.tickLength + 1)}
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

function Grid(props) {
  const style = {
    ...styles.grid,
    left: props.x,
    top: props.y
  };
  return (
    <div style={style}>
      <div style={styles.gridRow}>
        <PlaceHolderBars
          start={props.start}
          end={props.end}
          x={props.x}
          y={props.y}
          tickLength={props.tickLength}
        />
      </div>
    </div>
  );
}

function PlaceHolderBars(props) {
  let bars = [];
  for (let tick = props.start; tick < props.end + 1; tick++) {
    bars.push(
      <div key={"placeholder-" + tick.toString()} style={styles.gridCell}>
        &nbsp;
      </div>
    );
  }
  return bars;
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
            x={this.props.x + this.props.tickLength + 14}
            y={this.props.y + 18}
            tickLength={this.props.tickLength}
          />
        </div>
        <Grid
          start={this.props.start}
          end={this.props.end}
          x={this.props.x + 12}
          y={this.props.y + 36 - 8}
          tickLength={this.props.tickLength}
        />
      </div>
    );
  }
}
