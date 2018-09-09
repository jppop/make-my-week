import React, { Component } from 'react';
import './App.css';
import WeekWorkGrid from './components/WeekWorkGrid';
import TaskSearch from './components/TaskSearch';
import { WeekWork, Work, Task, Project } from './domain/WeekWork';
import Log from './Log';
import faker from 'faker';

faker.seed(1);
let projects = [];
for (let i = 0; i < 5; i++) {
  const project = new Project(faker.random.word(), faker.lorem.words());
  for (let t = 0; t < 10; t++) {
    const task = new Task(faker.random.word(), faker.lorem.words(), faker.internet.color());
    project.addTask(task);
  }
  projects.push(project);
}

const weekWork = new WeekWork(new Date(2018, 7, 20));
weekWork.addWork(0, Work.valueOf(projects[0].tasks[0], 8, 9));
weekWork.addWork(0, Work.valueOf(projects[0].tasks[1], 9, 11.25));
weekWork.addWork(0, Work.valueOf(projects[1].tasks[0], 14, 18));
weekWork.addWork(new Date(2018, 7, 21), Work.valueOf(projects[0].tasks[0], 8, 18));
weekWork.addWork(4, Work.valueOf(projects[0].tasks[0], 8, 9));
weekWork.addWork(4, Work.valueOf(projects[0].tasks[1], 9, 11.25));
weekWork.addWork(4, Work.valueOf(projects[1].tasks[0], 13, 18));

const allTasks = [];
projects.forEach(p => p.tasks.forEach(t => allTasks.push(t)));

Log.trace(weekWork);
Log.trace(allTasks);

class App extends Component {
  constructor() {
    super();
    this.state = {
      showTaskSearch: false
    };
  }
  closeTaskSelector = () => {
    this.setState({ showTaskSearch: false });
  }
  openTaskSelector = () => {
    this.setState({ showTaskSearch: true });
  }
  render() {
    return (
      <div className="App">
        <WeekWorkGrid data={weekWork} tasks={allTasks} />
        <div style={{ textAlign: 'left' }}>
          {this.state.showTaskSearch || <button onClick={() => this.openTaskSelector()}>Select task</button>}
          <TaskSearch
            tasks={allTasks}
            close={() => {
              this.closeTaskSelector();
            }}
            onSelectTask={task => {
              Log.trace(task);
              this.setState({ showTaskSearch: false });
            }}
            showing={this.state.showTaskSearch}
            x={20}
            y={20}
          />
        </div>
      </div>
    );
  }
}

export default App;
