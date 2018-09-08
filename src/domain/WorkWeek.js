// @flow

export class Project {
  id: string
  label: string
  tasks: Task[]

  constructor(id: string, label: string) {
    this.id = id;
    this.label = label;
    this.tasks = [];
  }
  addTask(task: Task) {
    task.projectId = this.id;
    this.tasks.push(task);
  }
  getTask(id: string): Task | null {
    let index = this.tasks.findIndex(task => task.id === id);
    if (index < 0) {
      return null;
    }
    return this.tasks[index];
  }
}

export class Task {
  id: string
  label: string
  color: string
  projectId: string

  constructor(id: string, label: string, color: string) {
    this.id = id;
    this.label = label;
    this.color = color;
    this.projectId = 'none';
  }
}

type WorkId = {
  project: string,
  task: string,
  work: string
}
type LunchTime = {
  start: number,
  end: number
}
export class Work {
  id: WorkId
  start: number
  end: number
  color: string
  hasLunchTime: ?boolean
  lunchTime: ?LunchTime
  dayIndex: ?number
  workTime: number[]

  constructor(task: Task, workId: string, start: number, end: number) {
    this.id = {
      project: task.projectId,
      task: task.id,
      work: workId
    };
    this.start = start;
    this.end = end;
    this.color = task.color;
    this.hasLunchTime = false;
    this.workTime = [0, 24];
  }
  static valueOf(task: Task, start: number, end: number): Work {
    const workId = Math.random()
      .toString(36)
      .substr(2);
    const work = new Work(task, workId, start, end);
    return work;
  }
  clone(): Work {
    let workItem: Work = Object.assign(Object.create(Object.getPrototypeOf((this: any))), this);
    return workItem;
  }
  duration(adjusted: boolean = false): number {
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

  durationAsString(adjusted: boolean = true): string {
    const duration = this.duration(adjusted);
    let hour = Math.trunc(duration);
    let minutes = (duration - hour) * 60;
    return hour.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
  }
}
type DayWork = {
  works: Work[]
}
export class WorkWeek {
  day: Date
  hasLunchTime: boolean
  lunchTime: LunchTime
  startTime: number
  endTime: number
  daysPerWeek: number
  timelines: DayWork[]

  constructor(day: Date = new Date(), daysPerWeek: number = 5) {
    this.day = day;
    this.hasLunchTime = true;
    this.lunchTime = { start: 12, end: 14 };
    this.startTime = 8;
    this.endTime = 19;
    this.daysPerWeek = daysPerWeek;
    this.timelines = Array(this.daysPerWeek)
      .fill(null)
      .map(() => {
        return { works: [] };
      });
  }

  addWork(day: number | Date, work: Work) {
    WorkWeek.addWeekWork(this, day, work);
  }

  static addWeekWork(workWeek: WorkWeek, day: number | Date, work: Work) {
    WorkWeek.attach(workWeek, day, work);

    let dayIndex = work.dayIndex || 0;
    if (0 <= dayIndex && dayIndex < workWeek.daysPerWeek) {
      workWeek.timelines[dayIndex].works.push(work);
    }
  }

  static attach(workWeek: WorkWeek, day: number | Date, work: Work) {
    let dayIndex: number;
    if (day instanceof Date) {
      dayIndex = day.getDay() - 1;
    } else {
      dayIndex = day;
    }
    const { hasLunchTime, lunchTime, startTime, endTime } = workWeek;
    work.hasLunchTime = hasLunchTime;
    work.lunchTime = lunchTime;
    work.workTime = [startTime, endTime];
    work.dayIndex = dayIndex;
    return work;
  }
}
