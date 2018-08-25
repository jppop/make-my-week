import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Bar from "./Bar";
import moment from "moment";
import { WorkWeek, Work } from "../domain/WorkWeek";
import Log from "../Log";

const QUATER_WIDTH = 16;

export default class WorkWeekGrid extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    cellHeight: PropTypes.number,
    cellWidth: PropTypes.number,
    leftMargin: PropTypes.number,
    rightMargin: PropTypes.number,
    quarterWidth: PropTypes.number
  };

  static defaultProps = {
    cellHeight: 14,
    cellWidth: QUATER_WIDTH * 4 - 2,
    quarterWidth: QUATER_WIDTH,
    leftMargin: 40,
    rightMargin: 20
  };

  constructor(props) {
    super(props);

    const workWeek = [];
    props.data.timelines.forEach(timeline => {
      return timeline.works.map(work => workWeek.push(work));
    });
    this.state = {
      workWeek: workWeek
    };

    this.bounds = React.createRef();

    const styles = {
      container: {
        position: "relative",
        fontFamily: "'Roboto', sans-serif",
        fontSize: 12,
        zIndex: 0
      },

      grid: isFirstChild => {
        let style = {
          display: "table",
          borderSpacing: 0,
          border: "1px solid darkgray"
        };
        if (isFirstChild) {
          style.marginTop = -1;
        }
        return style;
      },

      gridRow: {
        display: "table",
        borderSpacing: 0
      },

      gridCell: (isFirstChild, isLastChild, lunchTime) => {
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
            cursor: "default",
            color: "darkgray",
            textAlign: "right"
          };
        } else if (isLastChild) {
          lastChildStyle = {
            width: this.props.rightMargin,
            minWidth: this.props.rightMargin,
            cursor: "default",
            borderRight: "1px solid transparent"
          };
        }
        if (lunchTime) {
          style.backgroundColor = "#e6e6e6";
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
      bounds: lines => {
        return {
          position: "absolute",
          left: this.props.leftMargin + 3,
          top: (this.props.cellHeight + 2) * 2,
          height: (this.props.cellHeight + 2) * lines - 2,
          maxHeight: (this.props.cellHeight + 2) * lines - 2,
          width: (this.props.cellWidth + 2) * (this.props.data.endTime - this.props.data.startTime) - 1,
          maxWidth: (this.props.cellWidth + 2) * (this.props.data.endTime - this.props.data.startTime) - 1,
          zIndex: 2,
          pointerEvents: "auto",
          cursor: "crosshair"
        };
      }
    };

    this.styles = styles;
    this.styles.bounds.bind(this);
    this.styles.tickCell.bind(this);
    this.styles.scaleCell.bind(this);

    // this.onWorkItemUpdate.bind(this);
    // this.onGridClick.bind(this);
  }

  render() {
    const GridCell = props => {
      return (
        <div id={props.id} style={this.styles.gridCell(props.isFirstChild, props.isLastChild, props.lunchTime)}>
          {props.children}
        </div>
      );
    };

    const DayGrid = props => {
      let cells = [];
      const cellCount = 1 + props.end - props.start + 1;
      const cellLunchTimeStart = props.lunchTimeStart - props.start + 1;
      const cellLunchTimeEnd = props.end - props.lunchTimeEnd + 1;
      const day = moment(props.day).format("dd DD");
      for (let cell = 0; cell < cellCount; cell++) {
        cells.push(
          <GridCell
            key={"grid-cell#" + cell.toString()}
            id={"grid-cell#" + cell.toString()}
            isFirstChild={cell === 0}
            isLastChild={cell === cellCount - 1}
            lunchTime={cellLunchTimeStart <= cell && cell <= cellLunchTimeEnd}
          >
            {cell === 0 ? <span style={{ paddingRight: 2 }}>{day}</span> : <span>&nbsp;</span>}
          </GridCell>
        );
      }
      return (
        <div style={this.styles.grid(props.isFirstChild)}>
          <div style={this.styles.gridRow}>{cells}</div>
        </div>
      );
    };

    const Grid = props => {
      return props.workweek.timelines.map((timeline, dayIndex) => {
        let day = new Date(props.workweek.day);
        day.setDate(props.workweek.day.getDate() + dayIndex);
        let lunchTime = props.workweek.hasLunchTime && props.workweek.lunchTime;
        return (
          <DayGrid
            key={"day-grid#" + dayIndex}
            day={timeline.day || day}
            start={props.workweek.startTime}
            end={props.workweek.endTime}
            isFirstChild={dayIndex === 0}
            lunchTime={lunchTime}
            lunchTimeStart={lunchTime ? props.workweek.lunchTime.start : Number.MAX_VALUE}
            lunchTimeEnd={lunchTime ? props.workweek.lunchTime.end : -1}
          />
        );
      });
    };

    const ScaleCell = props => {
      return (
        <div style={this.styles.scaleCell(props.isFirstChild, props.isLastChild)}>
          <span style={props.isFirstChild ? {} : { marginLeft: -16 }}>{props.children}</span>
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
      return <div style={this.styles.tickCell(props.isFirstChild, props.isLastChild)}>&nbsp;</div>;
    };

    const Tick = props => {
      let cells = [];
      const cellCount = 1 + props.end - props.start + 1;
      for (let cell = 0; cell < cellCount; cell++) {
        cells.push(
          <TickCell key={"grid-tick#" + cell.toString()} isFirstChild={cell === 0} isLastChild={cell === cellCount - 1}>
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
      return props.workweek.map(work => {
        return (
          <Bar
            workItem={work}
            unit={[props.cellWidth + 2, props.cellHeight + 2]}
            key={"work#" + work.id.work}
            boundsSelector={props.boundsSelector}
            dragSizeIncrement={props.quarterWidth}
            maxWidth={props.maxWidth}
            x={(props.cellWidth + 2) * (work.start - props.startTime)}
            y={(props.cellHeight + 2) * work.dayIndex}
            width={(props.cellWidth + 2) * work.duration() - 1}
            color={work.color}
            onWorkItemUpdate={this.onWorkItemUpdate}
            contextMenuHandler={() => props.contextMenuHandler(work)}
          />
        );
      });
    };

    const boundStyle = this.styles.bounds(this.props.data.timelines.length);

    return (
      <div style={this.styles.container}>
        <Scale start={this.props.data.startTime} end={this.props.data.endTime} />
        <Tick start={this.props.data.startTime} end={this.props.data.endTime} />
        <Grid workweek={this.props.data} />
        <div ref={this.bounds} id="bounds" style={boundStyle} onClick={this.onAddWorkItem}>
          <div>
            <Works
              workweek={this.state.workWeek}
              boundsSelector="#bounds"
              quarterWidth={this.props.quarterWidth}
              cellWidth={this.props.cellWidth}
              cellHeight={this.props.cellHeight}
              startTime={this.props.data.startTime}
              contextMenuHandler={this.onRemoveWorkItem}
            />
          </div>
        </div>
      </div>
    );
  }

  onWorkItemUpdate = workItem => {
  }

  onAddWorkItem = e => {
    if (e.target.id !== this.bounds.current.id) {
      return;
    }
    e.preventDefault();

    const {startTime} = this.props.data;

    const boundingRect = ReactDOM.findDOMNode(this.bounds.current).getBoundingClientRect();
    const { clientX, clientY } = e;
    let start = startTime + Math.trunc((clientX - boundingRect.x) / (this.props.cellWidth + 2));
    let dayIndex = Math.trunc((clientY - boundingRect.y) / (this.props.cellHeight + 2));
    Log.trace(`grid position : (${start}, ${dayIndex})`)

    const work = Work.valueOf(this.props.projects[0].tasks[0], start, start + 1);
    WorkWeek.attach(this.props.data, dayIndex, work);

    this.setState(prevState => ({
      workWeek: [...prevState.workWeek, work]
    }));
  }

  onRemoveWorkItem = (workItem) => {
    Log.trace(workItem);
    Log.trace(this.state.workWeek);
    let workIndex = this.state.workWeek.findIndex(w => w.id.work === workItem.id.work);
    Log.trace(`workIndex: ${workIndex}`);
    if (workIndex !== -1) {
      let newWorkWeek = [...this.state.workWeek];
      newWorkWeek.splice(workIndex, 1);
      Log.trace(newWorkWeek);
      this.setState({
        workWeek: newWorkWeek
      })
    }
  }
}
