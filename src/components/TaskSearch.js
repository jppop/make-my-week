// @flow
import * as React from 'react';
import { Task } from '../domain/WeekWork';
import Log from '../Log';

type Props = {
  tasks: Task[],
  x: number,
  y: number,
  showing: boolean,
  close: () => void,
  onSelectTask?: Task => void
}

type State = {
  filter: string,
  xHovered: boolean
}

const selectorHeight = 100;
const styles = {
  selectorStyle: (x, y) => {
    return {
      boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.24)',
      backgroundColor: '#fff',
      width: 350,
      height: selectorHeight,
      position: 'relative',
      fontSize: 11,
      left: x,
      top: y,
      zIndex: 10,
      cursor: 'auto'
    };
  },
  taskContainer: { width: 350, height: selectorHeight - 40, overflow: 'auto' },
  tasks: { textAlign: 'left', margin: 0, paddingLeft: 20, listStyle: 'none' }
};

export default class TaskSearch extends React.Component<Props, State> {
  textInput: ?HTMLInputElement

  constructor(props: Props) {
    super(props);
    this.state = {
      filter: '',
      xHovered: false,
      selectedTask: null
    };
  }

  _close = () => {
    this.props.close();
    this.setState({ xHovered: false, filter: '' });
  }

  _onKeyPress = (e: KeyboardEvent) => {
    Log.trace('key pressed', 'TaskSearch::onKeyPress');
    if (e.keyCode === 27) {
      this._close();
    }
  }
  _onSelectTask = (event: SyntheticMouseEvent<HTMLElement>, task: Task) => {
    // event.stopPropagation();
    if (this.props.onSelectTask) {
      this.props.onSelectTask(task);
    }
  }

  componentDidUpdate() {
    Log.trace(this.textInput, 'TaskSearch::componentDidUpdate');

    if (this.textInput) {
      this.textInput.focus();
    }
  }

  componentWillUnmount() {
    if (!this.props.showing) {
      document.removeEventListener('keydown', this._onKeyPress, false);
    }
  }
  render() {
    const { showing, x, y } = this.props;
    if (showing) {
      document.addEventListener('keydown', this._onKeyPress, false);
      Log.trace(this.textInput, 'TaskSearch::render');
    } else {
      document.removeEventListener('keydown', this._onKeyPress, false);
    }
    let xStyle = {
      color: '#E8E8E8',
      fontSize: '20px',
      cursor: 'pointer',
      float: 'right',
      marginTop: '-32px',
      marginRight: '5px'
    };
    if (this.state.xHovered) {
      xStyle.color = '#4fb0fc';
    }
    const searchInput = (
      <div>
        <input
          style={{ margin: 10, width: '85%', borderRadius: 5, border: '1px solid #E8E8E8' }}
          type="text"
          placeholder="Search"
          value={this.state.filter}
          onChange={e => this.setState({ filter: e.target.value })}
          ref={input => {
            this.textInput = input;
          }}
        />
      </div>
    );
    const closeButton = (
      <span
        style={xStyle}
        onClick={this._close}
        onMouseEnter={() => this.setState({ xHovered: true })}
        onMouseLeave={() => this.setState({ xHovered: false })}
      >
        x
      </span>
    );
    const filter = this.state.filter.toLowerCase();
    const shownTasks = this.props.tasks.filter(task => {
      const words = filter.split(' ').filter(Boolean);
      if (words.length > 1) {
        // search on project and task label
        const projectFilter = words[0];
        const taskFilter = filter.substring(filter.indexOf(projectFilter) + projectFilter.length).trim();
        Log.trace(`project filter: ${projectFilter}, task filter: ${taskFilter}`, 'TaskSearch::filter');
        return (
          task.label.toLowerCase().indexOf(taskFilter) !== -1 && task.projectId.toLowerCase().startsWith(projectFilter)
        );
      }
      const anyFilter = filter.trim();
      return (
        task.label.toLowerCase().indexOf(anyFilter) !== -1 || task.projectId.toLowerCase().indexOf(anyFilter) !== -1
      );
    });

    const tasks = shownTasks.map(task => {
      return (
        <li key={task.projectId + ':' + task.id}>
          <span style={{ cursor: 'pointer' }} onClick={e => this._onSelectTask(e, task)}>
            {task.projectId} - {task.label}
          </span>
        </li>
      );
    });
    return (
      <div style={showing ? styles.selectorStyle(x, y) : { display: 'none' }} onClick={e => e.stopPropagation()}>
        {searchInput}
        {closeButton}
        <div style={styles.taskContainer}>
          <ul style={styles.tasks}>{tasks}</ul>
        </div>
      </div>
    );
  }
}
