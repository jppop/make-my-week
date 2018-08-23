import React, { Component } from "react";
import "./App.css";
import TimeGrid from "./components/TimeGrid";
import WorkWeekGrid from "./components/WorkWeekGrid";

class Project {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.tasks = [];
  }
  addTask(task) {
    task.projectId = this.id;
    this.tasks.push(task);
  }
}

let projects = [new Project("PRJ1", "Project 1"), new Project("PRJ2", "Project 2")];

class Task {
  constructor(id, label, color) {
    this.id = id;
    this.label = label;
    this.color = color;
  }
}
projects[0].addTask(new Task("T01", "Task #01", "steelblue"));
projects[0].addTask(new Task("T02", "Task #02", "olive"));
projects[1].addTask(new Task("T01", "Task #01", "aliceblue"));
projects[1].addTask(new Task("T02", "Task #02", "crimson"));

console.log(projects);

class Work {
  constructor(task, start, end) {
    this.id = { project: task.projectId, task: task.id };
    this.start = start;
    this.end = end;
    this.color = task.color;
  }
  duration() {
    return this.end - this.start;
  }
  durationAsString() {
    const duration = this.duration();
    let hour = Math.trunc(duration);
    let minutes = (duration - hour) * 60;
    return hour.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
  }
}

let data = {
  start: 8,
  end: 19,
  lunchTime: { start: 12, end: 14 },
  timelines: [
    {
      worker: "me",
      works: [
        new Work(projects[0].tasks[0], 8, 9),
        new Work(projects[0].tasks[1], 9, 11.25),
        new Work(projects[1].tasks[0], 14, 18)
      ]
    },
    {
      worker: "other",
      works: [new Work(projects[0].tasks[0], 8, 19)]
    }
  ]
};
console.log(data);

let weekWork = {
  start: 8,
  end: 19,
  lunchTime: { start: 12, end: 14 },
  day: new Date(2018, 8, 20),
  timelines: [
    {
      day: new Date(2018, 8, 20),
      works: [
        new Work(projects[0].tasks[0], 8, 9),
        new Work(projects[0].tasks[1], 9, 11.25),
        new Work(projects[1].tasks[0], 14, 18)
      ]
    },
    {
      day: new Date(2018, 8, 21),
      works: [new Work(projects[0].tasks[0], 8, 18)]
    },
    {
      day: new Date(2018, 8, 22),
      works: [new Work(projects[0].tasks[0], 8, 18)]
    },
    {
      day: new Date(2018, 8, 23),
      works: []
    },
    {
      day: new Date(2018, 8, 24),
      works: []
    }
  ]
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <TimeGrid data={data} />
        <WorkWeekGrid data={weekWork} />
      </div>
    );
  }
}

export default App;
