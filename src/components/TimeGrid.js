import React, { Component } from "react";
import PropTypes from "prop-types";
import Bar from "./Bar";

const QUATER_WIDTH = 16;

export default class TimeGrid extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    cellHeight: PropTypes.number,
    cellWidth: PropTypes.number,
    leftMargin: PropTypes.number,
    quarterWidth: PropTypes.number
  };

  static defaultProps = {
    cellHeight: 14,
    cellWidth: QUATER_WIDTH * 4 - 2,
    quarterWidth: QUATER_WIDTH,
    leftMargin: 20
  };

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data
    };

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
          width: this.props.cellWidth,
          minWidth: this.props.cellWidth,
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
            width: this.props.leftMargin,
            minWidth: this.props.leftMargin,
            cursor: "default"
          };
        } else if (isLastChild) {
          firstChildStyle = {
            width: this.props.leftMargin,
            minWidth: this.props.leftMargin,
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
          width: this.props.cellWidth,
          minWidth: this.props.cellWidth,
          height: "auto",
          borderLeft: "1px solid transparent",
          borderRight: "1px solid transparent",
          textAlign: "left"
        };
        if (isFirstChild) {
          style.width = this.props.leftMargin;
          style.minWidth = this.props.leftMargin;
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
          width: this.props.cellWidth,
          minWidth: this.props.cellWidth,
          height: "auto",
          borderLeft: "1px solid transparent",
          borderRight: "1px solid darkgray"
        };
        if (isFirstChild) {
          style.width = this.props.leftMargin;
          style.minWidth = this.props.leftMargin;
        } else if (isLastChild) {
          style.borderRight = "1px solid transparent";
        }
        return style;
      },
      bounds: index => {
        return {
          position: "absolute",
          left: this.props.leftMargin + 3,
          top: (this.props.cellHeight + 2) * (index + 2),
          height: this.props.cellHeight,
          maxHeight: this.props.cellHeight,
          width:
            (this.props.cellWidth + 2) *
            (this.props.data.end - this.props.data.start),
          maxWidth:
            (this.props.cellWidth + 2) *
            (this.props.data.end - this.props.data.start),
          cursor: "crosshair"
        };
      }
    };

    this.styles = styles;
    this.styles.bounds.bind(this);
    this.styles.tickCell.bind(this);
    this.styles.scaleCell.bind(this);
  }

  render() {
    const GridCell = props => {
      return (
        <div
          id={props.id}
          style={this.styles.gridCell(props.isFirstChild, props.isLastChild)}
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
          >
            &nbsp;
          </GridCell>
        );
      }
      return (
        <div style={this.styles.grid}>
          <div style={this.styles.gridRow}>{cells}</div>
        </div>
      );
    };

    const ScaleCell = props => {
      return (
        <div
          style={this.styles.scaleCell(props.isFirstChild, props.isLastChild)}
        >
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
        <div style={this.styles.scale}>
          <div style={this.styles.scaleRow}>{cells}</div>
        </div>
      );
    };

    const TickCell = props => {
      return (
        <div
          style={this.styles.tickCell(props.isFirstChild, props.isLastChild)}
        >
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
        <div style={this.styles.tick}>
          <div style={this.styles.tickRow}>{cells}</div>
        </div>
      );
    };

    const Works = props => {
      console.log(props)
      return props.works.map((work,index) => {
        return (
          <Bar
            key={"work#" + index}
            boundsSelector={props.boundsSelector}
            dragSizeIncrement={props.quarterWidth}
            maxWidth={props.maxWidth}
            x={(props.cellWidth + 2) * (work.start - props.start)}
            width={((props.cellWidth + 2) * work.duration()) - 1}
            color={work.color}
            text={work.durationAsString()}
          />
        );
      });
    };

    let works = this.state.data.timelines.map((timeline, index) => {
      const key = `work#${timeline.worker}`;
      const boundsId = `work-${timeline.worker}`;
      const maxWidth = this.styles.bounds(0).maxWidth;
      return (
        <div key={key}>
          <Grid start={this.props.data.start} end={this.props.data.end} />
          <div id={boundsId} style={this.styles.bounds(index)}>
            <Works
              works={timeline.works}
              start={this.props.data.start}
              boundsSelector={"#" + boundsId}
              quarterWidth = {this.props.quarterWidth}
              maxWidth={maxWidth}
              cellWidth = {this.props.cellWidth}
            />
          </div>
        </div>
      );
    });
    return (
      <div style={this.styles.container}>
        <Scale start={this.props.data.start} end={this.props.data.end} />
        <Tick start={this.props.data.start} end={this.props.data.end} />
        {works}
      </div>
    );
  }
}
