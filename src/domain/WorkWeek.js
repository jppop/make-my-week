export class Project {
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

export class Task {
  constructor(id, label, color) {
    this.id = id;
    this.label = label;
    this.color = color;
  }
}

export class Work {
  constructor(task, start, end) {
    this.id = { project: task.projectId, task: task.id , work: Math.random().toString(36).substr(2)};
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

export class WorkWeek {
  constructor(day, daysPerWeek) {
    this.day = day || new Date();
    this.hasLunchTime = true;
    this.lunchTime = { start: 12, end: 14 };
    this.startTime = 8;
    this.endTime = 19;
    this.daysPerWeek = daysPerWeek || 5;
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

