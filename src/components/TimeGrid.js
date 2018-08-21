import React, { Component } from "react";
import PropTypes from "prop-types";
import Bar from "./Bar";

const GRIDCELL_WIDTH = 16 * 4 - 2;

export default class TimeGrid extends Component {
  static propTypes = {
    start: PropTypes.number,
    end: PropTypes.number
  };

  static defaultProps = {
    start: 8,
    end: 19
  };

  constructor(props) {
    super(props);

    this.setCellRef = element => {
      console.log(element);
      if (element) {
        const rect = element.getBoundingClientRect();
        console.log(rect);
      }
    };
  }

  render() {
    const styles = {
      container: {
        position: "relative",
        fontFamily: "'Roboto', sans-serif",
        fontSize: 12
      },

      grid: {
        display: "table",
        borderSpacing: 0,
        border: "1px solid darkgray",
        marginTop: -1
      },

      gridRow: {
        display: "table",
        borderSpacing: 0
      },

      gridCell: (isFirstChild, isLastChild) => {
        let style = {
          display: "table-cell",
          width: GRIDCELL_WIDTH,
          minWidth: GRIDCELL_WIDTH,
          height: "auto",
          borderLeft: "1px solid transparent",
          borderRight: "1px solid darkgray",
          textAlign: "center",
          cursor: "crosshair"
        };
        let firstChildStyle = {};
        let lastChildStyle = {};
        if (isFirstChild) {
          firstChildStyle = {
            width: 20,
            minWidth: 20,
            cursor: "default"
          };
        } else if (isLastChild) {
          firstChildStyle = {
            width: 20,
            minWidth: 20,
            cursor: "default",
            borderRight: "1px solid transparent"
          };
        }
        return { ...style, ...firstChildStyle, ...lastChildStyle };
      },

      scale: {
        display: "table",
        borderSpacing: 0,
        border: "1px solid transparent"
      },

      scaleRow: {
        display: "table-row"
      },

      scaleCell: (isFirstChild, isLastChild) => {
        let style = {
          display: "table-cell",
          width: GRIDCELL_WIDTH,
          minWidth: GRIDCELL_WIDTH,
          height: "auto",
          borderLeft: "1px solid transparent",
          borderRight: "1px solid transparent",
          textAlign: "left"
        };
        if (isFirstChild) {
          style.width = 20;
          style.minWidth = 20;
        }
        return style;
      },

      tick: {
        display: "table",
        borderSpacing: 0,
        border: "1px solid transparent"
      },

      tickRow: {
        display: "table-row"
      },

      tickCell: (isFirstChild, isLastChild) => {
        let style = {
          display: "table-cell",
          width: GRIDCELL_WIDTH,
          minWidth: GRIDCELL_WIDTH,
          height: "auto",
          borderLeft: "1px solid transparent",
          borderRight: "1px solid darkgray"
        };
        if (isFirstChild) {
          style.width = 20;
          style.minWidth = 20;
        } else if (isLastChild) {
          style.borderRight = "1px solid transparent";
        }
        return style;
      },
      bounds: y => {
        return {
          position: "absolute",
          left: 23,
          top: y,
          height: 14,
          maxHeight: 14,
          width: (GRIDCELL_WIDTH + 2) * 11,
          maxWidth: (GRIDCELL_WIDTH + 2) * 11
        };
      }
    };

    const GridCell = props => {
      return (
        <div
          id={props.id}
          ref={props.cellRef}
          style={styles.gridCell(props.isFirstChild, props.isLastChild)}
        >
          {props.children}
        </div>
      );
    };

    const Grid = props => {
      let cells = [];
      const cellCount = 1 + props.end - props.start + 1;
      for (let cell = 0; cell < cellCount; cell++) {
        cells.push(
          <GridCell
            key={"grid-cell#" + cell.toString()}
            id={"grid-cell#" + cell.toString()}
            isFirstChild={cell === 0}
            isLastChild={cell === cellCount - 1}
            cellRef={props.cellRef}
          >
            &nbsp;
          </GridCell>
        );
      }
      return (
        <div style={styles.grid}>
          <div style={styles.gridRow}>{cells}</div>
        </div>
      );
    };

    const ScaleCell = props => {
      return (
        <div style={styles.scaleCell(props.isFirstChild, props.isLastChild)}>
          <span style={props.isFirstChild ? {} : { marginLeft: -16 }}>
            {props.children}
          </span>
        </div>
      );
    };

    const Scale = props => {
      let cells = [];
      for (let hour = props.start - 1; hour <= props.end; hour++) {
        cells.push(
          <ScaleCell
            key={"grid-scale#" + hour.toString()}
            isFirstChild={hour < props.start}
            isLastChild={!(hour < props.end)}
          >
            {hour < props.start ? "" : hour.toString().padStart(2, "0") + ":00"}
          </ScaleCell>
        );
      }
      return (
        <div style={styles.scale}>
          <div style={styles.scaleRow}>{cells}</div>
        </div>
      );
    };

    const TickCell = props => {
      return (
        <div style={styles.tickCell(props.isFirstChild, props.isLastChild)}>
          &nbsp;
        </div>
      );
    };

    const Tick = props => {
      let cells = [];
      const cellCount = 1 + props.end - props.start + 1;
      for (let cell = 0; cell < cellCount; cell++) {
        cells.push(
          <TickCell
            key={"grid-tick#" + cell.toString()}
            isFirstChild={cell === 0}
            isLastChild={cell === cellCount - 1}
          >
            &nbsp;
          </TickCell>
        );
      }
      return (
        <div style={styles.tick}>
          <div style={styles.tickRow}>{cells}</div>
        </div>
      );
    };

    return (
      <div style={styles.container}>
        <Scale start={this.props.start} end={this.props.end} />
        <Tick start={this.props.start} end={this.props.end} />
        <Grid
          start={this.props.start}
          end={this.props.end}
          cellRef={this.setCellRef}
        />
        <div id="bounds" style={styles.bounds(32)}>
          <Bar
            x={0}
            y={0}
            width={GRIDCELL_WIDTH + 2}
            color="red"
            text="01:00"
          />
          <Bar
            x={GRIDCELL_WIDTH + 2}
            y={0}
            width={(GRIDCELL_WIDTH + 2) * 2}
            color="blue"
            text="02:00"
          />
        </div>
      </div>
    );
  }
}
