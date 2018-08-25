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
  constructor(task, workId, start, end) {
    this.id = {
      project: task.projectId,
      task: task.id,
      work: workId
    };
    this.start = start;
    this.end = end;
    this.color = task.color;
    this.hasLunchTime = true;
  }
  static valueOf(task, start, end) {
    const workId = Math.random()
      .toString(36)
      .substr(2);
    const work = new Work(task, workId, start, end);
    return work;
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
        duration = a - this.start + (this.end - b);
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
    this.timelines = Array(this.daysPerWeek)
      .fill(null)
      .map(() => {
        return { works: [] };
      });
  }

  addWork(day, work) {
    WorkWeek.addWeekWork(this, day, work);
  }

  static addWeekWork(workWeek, day, work) {
    WorkWeek.attach(workWeek, day, work);

    if (work.dayIndex >= 0 && work.dayIndex < workWeek.daysPerWeek) {
      workWeek.timelines[work.dayIndex].works.push(work);
    }
  }

  static attach(workWeek, day, work) {
    let dayIndex;
    if (day instanceof Date) {
      dayIndex = day.getDay() - 1;
    } else {
      dayIndex = day;
    }
    const {hasLunchTime, lunchTime, startTime, endTime} = workWeek;
    work.hasLunchTime = hasLunchTime;
    work.lunchTime = lunchTime;
    work.workTime = [startTime, endTime];
    work.dayIndex = dayIndex;
    return work;
  }
}
