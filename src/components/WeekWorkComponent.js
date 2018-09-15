// @flow
import * as React from 'react';
import { WeekWork, Work, Task } from '../domain/WeekWork';
import WeekWorkGrid from './WeekWorkGrid';
import Log from '../Log';
import moment from 'moment';

type Props = {
  weekWork: WeekWork,
  tasks: Task[]
}
type State = {
  works: Work[],
  startDay: Date
}
export default class WeekWorkComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      works: this.props.weekWork.works,
      startDay: this.props.weekWork.day
    };
  }
  render() {
    const { works, startDay } = this.state;
    const { settings } = this.props.weekWork;

    const workTimeLine = works.map(work => {
      return (
        <li key={work.id.work}>
          <span style={{ backgroundColor: work.color, width: 16 }}>&nbsp;</span>
          <span>{work.label}</span>
          <br />
          <span>{moment(work.startTime).format('YYYY/MM/DD')}</span>
          &nbsp;
          <span>{moment(work.startTime).format('HH:mm')}</span>
          &nbsp;
          <span>{moment(work.endTime).format('HH:mm')}</span>
          &nbsp;
        </li>
      );
    });
    return (
      <div>
        <WeekWorkGrid
          works={works}
          startDay={startDay}
          settings={settings}
          tasks={this.props.tasks}
          addWorkItemHandler={this.addWorkItem}
          removeWorkItemHandler={this.onRemoveWorkItem}
          updateWorkItemHandler={this.onWorkItemUpdate}
        />
        <div style={{ textAlign: 'left' }}>
          <ol>{workTimeLine}</ol>
        </div>
      </div>
    );
  }

  addWorkItem = (task: Task, dayIndex: number, start: number, end: number): Work => {
    const workItem = Work.valueOf(task, start, end);
    WeekWork.attach(this.props.weekWork, dayIndex, workItem);
    let newWeekworks = [...this.state.works, workItem];
    WeekWork.fixWork(newWeekworks, workItem);

    this.setState({
      works: newWeekworks
    });

    return workItem;
  }

  onRemoveWorkItem = (workItem: Work): void => {
    let workIndex = this.state.works.findIndex(w => w.id.work === workItem.id.work);
    if (workIndex !== -1) {
      let newWeekWorks = [...this.state.works];
      newWeekWorks.splice(workIndex, 1);
      this.setState({
        works: newWeekWorks
      });
    }
  }

  onWorkItemUpdate = (workItem: Work): void => {
    let workIndex = this.state.works.findIndex(w => w.id.work === workItem.id.work);
    Log.trace(`workIndex: ${workIndex}`, 'WeekWorkComponent::onWorkItemUpdate');
    if (workIndex !== -1) {
      let newWeekworks = [...this.state.works];
      newWeekworks.splice(workIndex, 1, workItem);
      WeekWork.fixWork(newWeekworks, workItem);
      this.setState({
        works: newWeekworks
      });
      Log.trace(newWeekworks, 'WeekWorkComponent::onWorkItemUpdate');
    }
  }
}
