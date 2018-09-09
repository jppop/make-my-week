import React, { Component } from 'react';
import './App.css';
import WorkWeekGrid from './components/WorkWeekGrid';
import TaskSearch from './components/TaskSearch';
import { WorkWeek, Work, Task, Project } from './domain/WorkWeek';
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

const workWeek = new WorkWeek(new Date(2018, 7, 20));
workWeek.addWork(0, Work.valueOf(projects[0].tasks[0], 8, 9));
workWeek.addWork(0, Work.valueOf(projects[0].tasks[1], 9, 11.25));
workWeek.addWork(0, Work.valueOf(projects[1].tasks[0], 14, 18));
workWeek.addWork(new Date(2018, 7, 21), Work.valueOf(projects[0].tasks[0], 8, 18));
workWeek.addWork(4, Work.valueOf(projects[0].tasks[0], 8, 9));
workWeek.addWork(4, Work.valueOf(projects[0].tasks[1], 9, 11.25));
workWeek.addWork(4, Work.valueOf(projects[1].tasks[0], 13, 18));

const allTasks = [];
projects.forEach(p => p.tasks.forEach(t => allTasks.push(t)));

Log.trace(workWeek);
Log.trace(allTasks);

class App extends Component {
  render() {
    return (
      <div className="App">
        <WorkWeekGrid data={workWeek} projects={projects} />
        <div>
          <TaskSearch tasks={allTasks} close={() => {}} showing={true} x={20} y={20} />
        </div>
      </div>
    );
  }
}

export default App;
