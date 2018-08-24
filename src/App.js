import React, { Component } from "react";
import "./App.css";
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

class Work {
  constructor(task, start, end) {
    this.id = { project: task.projectId, task: task.id };
    this.start = start;
    this.end = end;
    this.color = task.color;
    this.hasLunchTime = true;
  }
  duration(adjusted) {
    let duration;
    if (adjusted && this.hasLunchTime && this.lunchTime) {
      const a = this.lunchTime.start;
      const b = this.lunchTime.end;
      if (b <= this.start || this.end <= a) {
        duration = this.end - this.start;
      } else if (a <= this.start && this.end <= b) {
        duration = 0;
      } else if (a <= this.start && b <= this.end) {
        duration = this.end - b;
      } else if (this.start <= a && this.end <= b) {
        duration = a - this.start;
      } else {
        duration = (a - this.start) + (this.end - b);
      }
    } else {
      duration = this.end - this.start;
    }
    return duration;
  }

  durationAsString() {
    const duration = this.duration(true);
    let hour = Math.trunc(duration);
    let minutes = (duration - hour) * 60;
    return hour.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
  }
}


class WorkWeek {
  constructor(day) {
    this.day = day || new Date();
    this.hasLunchTime = true;
    this.lunchTime = { start: 12, end: 14 };
    this.startTime = 8;
    this.endTime = 19;
    this.daysPerWeek = 5;
    this.timelines = Array(this.daysPerWeek).fill(null).map( () => { return {works: []}; } );
  }

  addWork(day, work) {
    let dayIndex;
    if (day instanceof Date) {
      dayIndex = day.getDay() - 1;
    } else {
      dayIndex = day;
    }
    if (dayIndex >= 0 && dayIndex < this.daysPerWeek) {
      work.hasLunchTime = this.hasLunchTime;
      work.lunchTime = this.lunchTime;
      work.workTime = [this.startTime, this.endTime];
      work.dayIndex = dayIndex;
      this.timelines[dayIndex].works.push(work);
    }
  }
}
const workWeek = new WorkWeek(new Date(2018, 7, 20));
workWeek.addWork(0, new Work(projects[0].tasks[0], 8, 9));
workWeek.addWork(0, new Work(projects[0].tasks[1], 9, 11.25));
workWeek.addWork(0, new Work(projects[1].tasks[0], 14, 18));
workWeek.addWork(new Date(2018, 7, 21), new Work(projects[0].tasks[0], 8, 18));
workWeek.addWork(4, new Work(projects[0].tasks[0], 8, 9));
workWeek.addWork(4, new Work(projects[0].tasks[1], 9, 11.25));
workWeek.addWork(4, new Work(projects[1].tasks[0], 13, 18));

console.log(workWeek);

class App extends Component {
  render() {
    return (
      <div className="App">
        <WorkWeekGrid data={workWeek} />
      </div>
    );
  }
}

export default App;
