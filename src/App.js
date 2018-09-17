import React, { Component } from 'react';
import './App.css';
import WeekWorkComponent from './components/WeekWorkComponent';
import { ProjectManager, WeekWork } from './domain/WeekWork';
import faker from 'faker';

const projectManager = new ProjectManager(new WeekWork(new Date(2018, 6, 16)));

faker.seed(1);
for (let i = 0; i < 5; i++) {
  const projectId = faker.random.word();
  projectManager.addProject(projectId, faker.lorem.words());
  for (let t = 0; t < 10; t++) {
    projectManager.addTask(projectId, faker.random.word(), faker.lorem.words(), faker.internet.color());
  }
}

let projectId = projectManager.projects[0].id;
let tasks = projectManager.getTasks(projectId);
projectManager.addWork(projectId, tasks[0].id, 0, 8, 9);
projectManager.addWork(projectId, tasks[1].id, 0, 9, 11.25);
projectManager.addWork(projectId, tasks[2].id, 0, 14, 18);

projectId = projectManager.projects[1].id;
tasks = projectManager.getTasks(projectId);
projectManager.addWork(projectId, tasks[1].id, 1, 9, 11.25);
projectManager.addWork(projectId, tasks[2].id, 1, 14, 18);

projectId = projectManager.projects[2].id;
tasks = projectManager.getTasks(projectId);
projectManager.addWork(projectId, tasks[0].id, 2, 9, 13);
projectManager.addWork(projectId, tasks[1].id, 2, 14, 18);

projectId = projectManager.projects[3].id;
tasks = projectManager.getTasks(projectId);
projectManager.addWork(projectId, tasks[0].id, 3, 9, 18);

class App extends Component {
  render() {
    return (
      <div className="App">
        <WeekWorkComponent projectManager={projectManager} />
      </div>
    );
  }
}

export default App;
