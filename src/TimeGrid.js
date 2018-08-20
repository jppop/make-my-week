import React, { Component } from "react";
import PropTypes from "prop-types";

const styles = {
  container: {
    position: "relative",
    fontFamily: "'Roboto', sans-serif",
    fontSize: 12,
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
    border: '1px solid darkgrey',
  },
};

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
          {this.createAllTicks({
            start: this.props.start,
            end: this.props.end,
            x: this.props.x + this.props.tickLength,
            y: this.props.y,
            tickLength: this.props.tickLength
          })}
        </div>
        <div>
          {this.createAllTickLines({
            start: this.props.start,
            end: this.props.end,
            x: this.props.x + this.props.tickLength,
            y: this.props.y + 18,
            tickLength: this.props.tickLength
          })}
        </div>
        <div>
          {this.createAllEmptyBars({
            start: this.props.start,
            end: this.props.end,
            x: this.props.x,
            y: this.props.y + 36 - 8,
            tickLength: this.props.tickLength
          })}
        </div>
      </div>
    );
  }

  createAllTicks = props => {
    let ticks = [];
    for (let tick = props.start; tick < props.end; tick++) {
      ticks.push(
        this.createTick({
          tick: tick,
          x: props.x + (tick - props.start) * props.tickLength,
          y: props.y
        })
      );
    }
    return ticks;
  };

  createTick = props => {
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
  };

  createAllTickLines = props => {
    let ticks = [];
    for (let tick = props.start; tick < props.end; tick++) {
      ticks.push(
        this.createTickLine({
          x: 15 + props.x + ((tick - props.start) * props.tickLength),
          y: props.y
        })
      );
    }
    return ticks;
  };

  createTickLine = props => {
    const tickLineStyle = {
      ...styles.tickLine,
      left: props.x,
      top: props.y
    };
    return <div style={tickLineStyle} />;
  };

  createAllEmptyBars = props => {
    let bars = [];
    for (let tick = props.start; tick < props.end + 1; tick++) {
      bars.push(
        this.createEmptyBar({
          x: 15 + props.x + ((tick - props.start) * props.tickLength),
          y: props.y,
          width: props.tickLength,
        })
      );
    }
    return bars;
  };

  createEmptyBar = props => {
    const barStyle = {
      ...styles.bar,
      left: props.x,
      top: props.y,
      height: 'auto', 
      width: props.width,
    };
    return <div style={barStyle}>&nbsp;</div>;
  };
}
