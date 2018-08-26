import React, { Component } from 'react';
import './App.css';
import WorkWeekGrid from './components/WorkWeekGrid';
import {WorkWeek, Work, Task, Project} from './domain/WorkWeek';
import Log from './Log';

let projects = [new Project('PRJ1', 'Project 1'), new Project('PRJ2', 'Project 2')];

projects[0].addTask(new Task('T01', 'Task #01', 'steelblue'));
projects[0].addTask(new Task('T02', 'Task #02', 'olive'));
projects[1].addTask(new Task('T01', 'Task #01', 'aliceblue'));
projects[1].addTask(new Task('T02', 'Task #02', 'crimson'));

const workWeek = new WorkWeek(new Date(2018, 7, 20));
workWeek.addWork(0, Work.valueOf(projects[0].tasks[0], 8, 9));
workWeek.addWork(0, Work.valueOf(projects[0].tasks[1], 9, 11.25));
workWeek.addWork(0, Work.valueOf(projects[1].tasks[0], 14, 18));
workWeek.addWork(new Date(2018, 7, 21), Work.valueOf(projects[0].tasks[0], 8, 18));
workWeek.addWork(4, Work.valueOf(projects[0].tasks[0], 8, 9));
workWeek.addWork(4, Work.valueOf(projects[0].tasks[1], 9, 11.25));
workWeek.addWork(4, Work.valueOf(projects[1].tasks[0], 13, 18));

Log.trace(workWeek);

class App extends Component {
  render() {
    return (
      <div className="App">
        <WorkWeekGrid data={workWeek} projects={projects}/>
      </div>
    );
  }
}

export default App;
