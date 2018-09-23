import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import TimeBar from './TimeBar';
import TaskSearch from './TaskSearch';
import moment from 'moment';
import { Work } from '../domain/WeekWork';
import Log from '../Log';
import { withStyles } from '@material-ui/core';
import { toClass } from 'recompose';

const QUATER_WIDTH = 16;
const ZINDEX_BASE = 0;

const styles = theme => ({
  root: {}
});

const gridCellKey = (dayIndex, cell) => `grid-cell-${dayIndex}x${cell}`;

class WeekWorkGrid extends Component {
  static propTypes = {
    works: PropTypes.arrayOf(PropTypes.instanceOf(Work)).isRequired,
    settings: PropTypes.object.isRequired,
    startDay: PropTypes.instanceOf(Date).isRequired,
    tasks: PropTypes.func.isRequired,
    cellHeight: PropTypes.number,
    cellWidth: PropTypes.number,
    leftMargin: PropTypes.number,
    rightMargin: PropTypes.number,
    quarterWidth: PropTypes.number,
    addWorkItemHandler: PropTypes.func.isRequired,
    removeWorkItemHandler: PropTypes.func.isRequired,
    updateWorkItemHandler: PropTypes.func.isRequired
  }

  static defaultProps = {
    cellHeight: 14,
    cellWidth: QUATER_WIDTH * 4 - 2,
    quarterWidth: QUATER_WIDTH,
    leftMargin: 40,
    rightMargin: 20
  }

  constructor(props) {
    super(props);

    this.state = {
      showTaskSearch: false,
      anchorEL: null,
      callBack: () => {}
    };

    this.bounds = React.createRef();

    const styles = {
      container: {
        position: 'relative',
        fontFamily: '\'Roboto\', sans-serif',
        fontSize: 12,
        boxSizing: 'content-box',
        zIndex: ZINDEX_BASE,
        WebkitFontSmoothing: 'auto'
      },

      grid: isFirstChild => {
        let style = {
          display: 'table',
          borderSpacing: 0,
          border: '1px solid darkgray'
        };
        if (isFirstChild) {
          style.marginTop = -1;
        }
        return style;
      },

      gridRow: {
        display: 'table',
        borderSpacing: 0
      },

      gridCell: (isFirstChild, isLastChild, lunchTime) => {
        let style = {
          display: 'table-cell',
          width: this.props.cellWidth,
          minWidth: this.props.cellWidth,
          height: 'auto',
          borderLeft: '1px solid transparent',
          borderRight: '1px solid darkgray',
          textAlign: 'center',
          cursor: 'crosshair'
        };
        let firstChildStyle = {};
        let lastChildStyle = {};
        if (isFirstChild) {
          firstChildStyle = {
            width: this.props.leftMargin,
            minWidth: this.props.leftMargin,
            cursor: 'default',
            color: 'darkgray',
            textAlign: 'right'
          };
        } else if (isLastChild) {
          lastChildStyle = {
            width: this.props.rightMargin,
            minWidth: this.props.rightMargin,
            cursor: 'default',
            borderRight: '1px solid transparent'
          };
        }
        if (lunchTime) {
          style.backgroundColor = '#e6e6e6';
        }
        return { ...style, ...firstChildStyle, ...lastChildStyle };
      },

      scale: {
        display: 'table',
        borderSpacing: 0,
        border: '1px solid transparent'
      },

      scaleRow: {
        display: 'table-row'
      },

      scaleCell: (isFirstChild, isLastChild) => {
        let style = {
          display: 'table-cell',
          width: this.props.cellWidth,
          minWidth: this.props.cellWidth,
          height: 'auto',
          borderLeft: '1px solid transparent',
          borderRight: '1px solid transparent',
          textAlign: 'left'
        };
        if (isFirstChild) {
          style.width = this.props.leftMargin;
          style.minWidth = this.props.leftMargin;
        }
        return style;
      },

      tick: {
        display: 'table',
        borderSpacing: 0,
        border: '1px solid transparent'
      },

      tickRow: {
        display: 'table-row'
      },

      tickCell: (isFirstChild, isLastChild) => {
        let style = {
          display: 'table-cell',
          width: this.props.cellWidth,
          minWidth: this.props.cellWidth,
          height: 'auto',
          borderLeft: '1px solid transparent',
          borderRight: '1px solid darkgray'
        };
        if (isFirstChild) {
          style.width = this.props.leftMargin;
          style.minWidth = this.props.leftMargin;
        } else if (isLastChild) {
          style.borderRight = '1px solid transparent';
        }
        return style;
      },
      bounds: lines => {
        const { settings } = this.props;
        return {
          position: 'absolute',
          left: this.props.leftMargin + 3,
          top: (this.props.cellHeight + 2) * 2,
          height: (this.props.cellHeight + 2) * lines - 2,
          maxHeight: (this.props.cellHeight + 2) * lines - 2,
          width: (this.props.cellWidth + 2) * (settings.endTime - settings.startTime) - 1,
          maxWidth: (this.props.cellWidth + 2) * (settings.endTime - settings.startTime) - 1,
          zIndex: ZINDEX_BASE + 2,
          pointerEvents: 'auto',
          cursor: 'crosshair'
        };
      }
    };

    this.styles = styles;
    this.styles.bounds.bind(this);
    this.styles.tickCell.bind(this);
    this.styles.scaleCell.bind(this);
  }

  render() {
    const { settings } = this.props;
    Log.trace(settings, 'WeekWorkGrid::render');

    this._gridCells = [];

    const GridCell = toClass(props => {
      return (
        <div
          id={props.id}
          style={this.styles.gridCell(props.isFirstChild, props.isLastChild, props.lunchTime)}
          ref={el => {if (el) {this._gridCells[el.id] = el;}}}
        >
          {props.children}
        </div>
      );
    });

    const DayGrid = props => {
      let cells = [];
      const cellCount = 1 + props.end - props.start + 1;
      const cellLunchTimeStart = props.lunchTimeStart - props.start + 1;
      const cellLunchTimeEnd = props.end - props.lunchTimeEnd + 1;
      const day = moment(props.day).format('dd DD');
      for (let cell = 0; cell < cellCount; cell++) {
        const key = gridCellKey(props.dayIndex, cell);
        cells.push(
          <GridCell
            key={key}
            id={key}
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
      const { hasLunchTime, lunchTime, startTime, endTime, daysPerWeek } = props.settings;

      let grid = [];
      for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
        let day = new Date(props.startDay);
        day.setDate(day.getDate() + dayIndex);
        grid.push(
          <DayGrid
            key={'day-grid#' + dayIndex}
            dayIndex={dayIndex}
            day={day}
            start={startTime}
            end={endTime}
            isFirstChild={dayIndex === 0}
            lunchTime={lunchTime}
            lunchTimeStart={hasLunchTime ? lunchTime.start : Number.MAX_VALUE}
            lunchTimeEnd={hasLunchTime ? lunchTime.end : -1}
          />
        );
      }
      return grid;
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
            key={'grid-scale#' + hour.toString()}
            isFirstChild={hour < props.start}
            isLastChild={!(hour < props.end)}
          >
            {hour < props.start ? '' : hour.toString().padStart(2, '0') + ':00'}
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
          <TickCell key={'grid-tick#' + cell.toString()} isFirstChild={cell === 0} isLastChild={cell === cellCount - 1}>
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
      return props.weekwork.map(work => {
        return (
          <TimeBar
            workItem={work}
            unit={[props.cellWidth + 2, props.cellHeight + 2]}
            key={'work#' + work.id.work}
            boundsSelector={props.boundsSelector}
            dragSizeIncrement={props.quarterWidth}
            maxWidth={props.maxWidth}
            onWorkItemUpdate={this.onWorkItemUpdate}
            contextMenuHandler={() => props.contextMenuHandler(work)}
          />
        );
      });
    };

    const boundStyle = this.styles.bounds(settings.daysPerWeek);

    return (
      <div style={this.styles.container}>
        <Scale start={settings.startTime} end={settings.endTime} />
        <Tick start={settings.startTime} end={settings.endTime} />
        <Grid settings={this.props.settings} startDay={this.props.startDay} />
        <div ref={this.bounds} id="bounds" style={boundStyle} onClick={this._onAddWorkItem}>
          <div>
            <Works
              weekwork={this.props.works}
              boundsSelector="#bounds"
              quarterWidth={this.props.quarterWidth}
              cellWidth={this.props.cellWidth}
              cellHeight={this.props.cellHeight}
              startTime={settings.startTime}
              contextMenuHandler={this._onRemoveWorkItem}
            />
            <TaskSearch
              tasks={this.props.tasks}
              close={() => {
                this._closeTaskSelector();
              }}
              onSelectTask={task => {
                Log.trace(task);
                this.setState({ showTaskSearch: false });
                this.state.callBack(task);
              }}
              showing={this.state.showTaskSearch}
              anchorEl={this.state.anchorEl}
            />
          </div>
        </div>
      </div>
    );
  }

  newWorkItem = {
    startTime: NaN,
    endTime: NaN,
    dayIndex: NaN
  }

  _onAddWorkItem = e => {
    if (e.currentTarget.id !== this.bounds.current.id) {
      return;
    }
    e.stopPropagation();

    const { offsetX, offsetY } = e.nativeEvent;
    Log.trace(`position: (${offsetX}, ${offsetY})`, 'WeekWorkGrid::onAddWorkItem');

    const { startTime, defaultWorkDuration } = this.props.settings;

    const boundingRect = ReactDOM.findDOMNode(this.bounds.current).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node
    Log.trace(boundingRect, 'WeekWorkGrid::_onAddWorkItem');
    const { clientX, clientY } = e;
    let start = startTime + Math.trunc((clientX - boundingRect.x) / (this.props.cellWidth + 2));

    let dayIndex = Math.trunc((clientY - boundingRect.y) / (this.props.cellHeight + 2));

    // keep around start time
    this.newWorkItem = {
      startTime: start,
      endTime: start + defaultWorkDuration,
      dayIndex: dayIndex
    };
    Log.trace(`grid position: (${start}, ${dayIndex})`, 'WeekWorkGrid::_onAddWorkItem');
    const gridCellId = gridCellKey(dayIndex, start - startTime + 1);
    Log.trace(`grid cell id: ${gridCellId}`, 'WeekWorkGrid::_onAddWorkItem');
    const gridCell = this._gridCells[gridCellId];
    Log.trace(gridCell, 'WeekWorkGrid::_onAddWorkItem');
    Log.trace(gridCell.getBoundingClientRect(), 'WeekWorkGrid::_onAddWorkItem');

    // open the task selector
    const newWorkInfo = {
      startTime: start,
      endTime: start + defaultWorkDuration,
      dayIndex: dayIndex
    };
    this._openTaskSelector(gridCell, (task) => this._addWorkItem(task, newWorkInfo));
  }

  _addWorkItem = (task, newWorkInfo) => {
    const { startTime, endTime, dayIndex } = newWorkInfo;
    this.props.addWorkItemHandler(task, dayIndex, startTime, endTime);
  }

  onWorkItemUpdate = workItem => {
    Log.trace(workItem, 'WeekWorkGrid::onWorkItemUpdate');
    this.props.updateWorkItemHandler(workItem);
  }

  _onRemoveWorkItem = workItem => {
    this.props.removeWorkItemHandler(workItem);
  }
  _closeTaskSelector = () => {
    this.setState({ showTaskSearch: false });
  }
  _openTaskSelector = (anchorEl, callBack) => {
    this.setState({
      showTaskSearch: true,
      anchorEl: anchorEl,
      callBack: callBack
    });
  }
}

export default withStyles(styles)(WeekWorkGrid);
