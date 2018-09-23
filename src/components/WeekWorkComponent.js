// @flow
import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WorkTimeline from './WorkTimeline';
import { ProjectManager, Work, Task } from '../domain/WeekWork';
import WeekWorkGrid from './WeekWorkGrid';
import Log from '../Log';

const styles = (theme: Object) => ({
  root: {},
  weekWorkContainer: {
    maxWidth: 720
  },
  weekWork: {},
  timeline: {}
});

type ProvidedProps = {
  classes: Object
}
type Props = {
  classes: Object,
  projectManager: ProjectManager
}
type State = {
  works: Work[],
  startDay: Date,
  endDay: Date
}
type OptionType = {
  [string]: any
}

type OptionsType = Array<OptionType>

type GroupType = {
  options: OptionsType,
  [string]: any
}

class WeekWorkComponent extends React.Component<ProvidedProps & Props, State> {
  options: Array<GroupType>

  constructor(props: ProvidedProps & Props) {
    super(props);
    this.state = {
      works: this.props.projectManager.weekWork.works,
      startDay: this.props.projectManager.weekWork.startDay,
      endDay: this.props.projectManager.weekWork.endDay
    };
    // const options = props.projectManager.projects.map(p => {
    //   const taskOptions = p.tasks.map(t => {
    //     return { value: t.id, label: t.label };
    //   });
    //   const options = {
    //     label: p.id,
    //     options: taskOptions
    //   };
    //   return options;
    // });
    // this.options = options;
  }
  render() {
    const { classes } = this.props;
    const { works, startDay, endDay } = this.state;
    const { settings } = this.props.projectManager.weekWork;

    return (
      <div className={classes.root}>
        <Grid container className={classes.weekWorkContainer} justify="center">
          <Grid item xs={12}>
            <Typography variant="subheading">{startDay.toDateString()}</Typography>
          </Grid>
          <Grid item xs={12} className={classes.weekWork}>
            <WeekWorkGrid
              works={works}
              startDay={startDay}
              settings={settings}
              tasks={() => this.props.projectManager.getAllTasks()}
              addWorkItemHandler={this.addWorkItem}
              removeWorkItemHandler={this.onRemoveWorkItem}
              updateWorkItemHandler={this.onWorkItemUpdate}
            />
          </Grid>
          <Grid item xs={12} className={classes.timeline}>
            <WorkTimeline works={works} startDay={startDay} endDay={endDay} onDelete={this.onRemoveWorkItem} />
          </Grid>
        </Grid>
      </div>
    );
  }

  addWorkItem = (task: Task, dayIndex: number, start: number, end: number): void => {
    try {
      this.props.projectManager.addWork(task.projectId, task.id, dayIndex, start, end);
    } catch (e) {
      Log.trace(e, 'WeekWorkComponent::addWorkItem');
    }
    this.setState({
      works: this.props.projectManager.getWorks()
    });
  }

  onRemoveWorkItem = (workItem: Work): void => {
    try {
      this.props.projectManager.deleteWork(workItem.id.work);
    } catch (e) {
      Log.trace(e, 'WeekWorkComponent::onRemoveWorkItem');
    }
    this.setState({
      works: this.props.projectManager.getWorks()
    });
  }

  onWorkItemUpdate = (workItem: Work): void => {
    try {
      this.props.projectManager.updateWork(workItem);
    } catch (e) {
      Log.trace(e, 'WeekWorkComponent::onWorkItemUpdate');
    }
    this.setState({
      works: this.props.projectManager.getWorks()
    });
  }
}
export default withStyles(styles)(WeekWorkComponent);
