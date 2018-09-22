// @flow
import * as React from 'react';
import { Task } from '../domain/WeekWork';
import Log from '../Log';
import { withStyles } from '@material-ui/core';

const selectorHeight = 100;

const styles = (theme: Object) => ({
  root: {
    position: 'relative',
    zIndex: theme.zIndex.snackbar
  },
  scrollContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    fontSize: theme.typography.body1.fontSize,
    width: 350,
    height: selectorHeight,
    marginBottom: theme.spacing.unit * 3,
    zIndex: theme.zIndex.snackbar
  },
  scroll: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  taskContainer: {
    overflow: 'auto',
    width: 350,
    height: selectorHeight - 40,
    zIndex: 'inherit',
    position: 'relative'
  },
  tasks: { position: 'relative', zIndex: 'inherit', textAlign: 'left', margin: 0, paddingLeft: 20, listStyle: 'none' },
  xStyle: {
    color: theme.palette.action.disabled,
    fontSize: theme.typography.fontSize,
    cursor: 'pointer',
    float: 'right',
    marginTop: '-32px',
    marginRight: '5px',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  input: {
    margin: 10,
    width: '85%',
    borderRadius: 5,
    border: `1px solid ${theme.palette.background.paper}`
  }
});

type ProvidedProps = {
  classes: Object
}
type Props = {
  classes: Object,
  tasks: () => Task[],
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

class TaskSearch extends React.Component<ProvidedProps & Props, State> {
  textInput: ?HTMLInputElement

  constructor(props: ProvidedProps & Props) {
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
    // Log.trace(this.textInput, 'TaskSearch::componentDidUpdate');

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
    Log.trace(this.textInput, 'TaskSearch::render');

    if (!this.props.showing) {
      document.removeEventListener('keydown', this._onKeyPress, false);
      return <div style={{ display: 'none' }} />;
    }
    document.addEventListener('keydown', this._onKeyPress, false);

    const { x, y, classes } = this.props;
    let shownTasks: Task[] = [];
    const filter = this.state.filter.toLowerCase();
    shownTasks = this._getTasks(filter);
    const searchInput = (
      <div>
        <input
          className={classes.input}
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
        className={classes.xStyle}
        onClick={this._close}
        onMouseEnter={() => this.setState({ xHovered: true })}
        onMouseLeave={() => this.setState({ xHovered: false })}
      >
        x
      </span>
    );

    const taskList = shownTasks.map(task => {
      return (
        <li key={task.projectId + ':' + task.id}>
          <span style={{ cursor: 'pointer' }} onClick={e => this._onSelectTask(e, task)}>
            {task.projectId} - {task.label}
          </span>
        </li>
      );
    });
    return (
      <div className={classes.root} style={{ left: x, top: y }} onClick={e => e.stopPropagation()}>
        <div className={classes.scrollContainer}>
          {searchInput}
          {closeButton}
          <div className={classes.taskContainer}>
            <ul className={classes.tasks}>{taskList}</ul>
          </div>
        </div>
      </div>
    );
  }

  _getTasks = (filter: string): Task[] => {
    const shownTasks = this.props.tasks().filter(task => {
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
    return shownTasks;
  }
}

export default withStyles(styles)(TaskSearch);
