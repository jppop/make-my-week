import React, { Component } from "react";
import PropTypes from "prop-types";

const GRIDCELL_WIDTH = 48;

export default class TimeGrid extends Component {

  static propTypes = {
    start: PropTypes.number,
    end: PropTypes.number
  };

  static defaultProps = {
    start: 8,
    end: 19
  };

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
        borderSpacing: 0,
        border: "1px solid darkgray"
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
      }
    };

    const GridCell = props => {
      return (<div style={styles.gridCell(props.isFirstChild, props.isLastChild)}>{props.children}</div>)
    }

    const Grid = props => {
      let cells = [];
      const cellCount = 1 + props.end - props.start + 1;
      for (let cell = 0; cell < cellCount; cell++) {
        cells.push(<GridCell key={'grid-cell#' + cell.toString()} isFirstChild={cell === 0} isLastChild={cell === cellCount -1}>&nbsp;</GridCell>)
      }
      return (
        <div style={styles.grid}>
          <div style={styles.gridRow}>{cells}</div>
        </div>
      );
    };

    return (
      <div style={styles.container}>
        <Grid start={this.props.start} end={this.props.end} />
      </div>
    );
  }
}
