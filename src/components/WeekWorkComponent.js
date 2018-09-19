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
    this.props.projectManager.addWork(task.projectId, task.id, dayIndex, start, end);

    this.setState({
      works: this.props.projectManager.getWorks()
    });
  }

  onRemoveWorkItem = (workItem: Work): void => {
    this.props.projectManager.deleteWork(workItem.id.work);
    this.setState({
      works: this.props.projectManager.getWorks()
    });
  }

  onWorkItemUpdate = (workItem: Work): void => {
    this.props.projectManager.updateWork(workItem);
    this.setState({
      works: this.props.projectManager.getWorks()
    });
  }
}
