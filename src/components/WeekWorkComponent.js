// @flow
import * as React from 'react';
import WorkTimeline from './WorkTimeline';
import { ProjectManager, Work, Task } from '../domain/WeekWork';
import WeekWorkGrid from './WeekWorkGrid';

type Props = {
  projectManager: ProjectManager
}
type State = {
  works: Work[],
  startDay: Date
}

export default class WeekWorkComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      works: this.props.projectManager.weekWork.works,
      startDay: this.props.projectManager.weekWork.day
    };
  }
  render() {
    const { works, startDay } = this.state;
    const { settings } = this.props.projectManager.weekWork;

    return (
      <div>
        <WeekWorkGrid
          works={works}
          startDay={startDay}
          settings={settings}
          tasks={() => this.props.projectManager.getAllTasks()}
          addWorkItemHandler={this.addWorkItem}
          removeWorkItemHandler={this.onRemoveWorkItem}
          updateWorkItemHandler={this.onWorkItemUpdate}
        />
        <div style={{ textAlign: 'left' }}>
          <WorkTimeline works={works} />
        </div>
      </div>
    );
  }

  addWorkItem = (task: Task, dayIndex: number, start: number, end: number): void => {
    const newWeekworks = this.props.projectManager.addWork(task.projectId, task.id, dayIndex, start, end);

    this.setState({
      works: newWeekworks
    });
  }

  onRemoveWorkItem = (workItem: Work): void => {
    const newWeekWorks = this.props.projectManager.deleteWork(workItem.id.work);
    this.setState({
      works: newWeekWorks
    });
  }

  onWorkItemUpdate = (workItem: Work): void => {
    const newWeekWorks = this.props.projectManager.updateWork(workItem);
    this.setState({
      works: newWeekWorks
    });
  }
}
