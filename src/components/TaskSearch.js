// @flow
import * as React from 'react';
import { Task } from '../domain/WorkWeek';
import Log from '../Log';

type Props = {
  tasks: Task[],
  x: number,
  y: number,
  showing: boolean,
  close: () => void
}

type State = {
  filter: string,
  xHovered: boolean
}

const selectorStyle = (x, y) => {
  return {
    boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.24)',
    backgroundColor: '#fff',
    width: '350px',
    height: '220px',
    position: 'relative',
    fontSize: 11,
    left: x,
    top: y
  };
};

export default class TaskSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filter: '',
      xHovered: false
    };
  }

  render() {
    const { showing, x, y, close } = this.props;
    let xStyle = {
      color: '#E8E8E8',
      fontSize: '20px',
      cursor: 'pointer',
      float: 'right',
      marginTop: '-32px',
      marginRight: '2px'
    };
    if (this.state.xHovered) {
      xStyle.color = '#4fb0fc';
    }
    const searchInput = (
      <div>
        <input
          style={{ margin: '10px', width: '85%', borderRadius: '5px', border: '1px solid #E8E8E8' }}
          type="text"
          placeholder="Search"
          value={this.state.filter}
          onChange={e => this.setState({ filter: e.target.value })}
        />
      </div>
    );
    const closeButton = (
      <span
        style={xStyle}
        onClick={() => {
          this.setState({ xHovered: false });
          close();
        }}
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
        const taskFilter = filter.substring(filter.indexOf(words[1])).trim();
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
          {task.projectId} - {task.label}
        </li>
      );
    });
    return (
      <div style={showing ? selectorStyle(x, y) : { display: 'none' }}>
        {searchInput}
        {closeButton}
        <div style={{ width: '350', height: '180px', overflow: 'auto' }}>
          <ul style={{ textAlign: 'left', margin: 0, height: 180 }}>{tasks}</ul>
        </div>
      </div>
    );
  }
}
