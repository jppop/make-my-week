// @flow

const hoursAndMinutes = (time: number) => {
  const hours = Math.trunc(time);
  const minutes = (time - hours) * 60;
  return {
    hours: hours,
    minutes: minutes
  };
};

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
  startTime: Date
  endTime: Date
  color: string
  hasLunchTime: ?boolean
  lunchTime: ?LunchTime
  _dayIndex: number
  workTime: number[]
  label: string

  constructor(task: Task, workId: string, start: number, end: number) {
    this.id = {
      project: task.projectId,
      task: task.id,
      work: workId
    };
    this.label = task.projectId + ' - ' + task.label;
    this.startTime = new Date();
    let hm = hoursAndMinutes(start);
    this.startTime.setHours(hm.hours, hm.minutes, 0, 0);
    this.endTime = new Date();
    hm = hoursAndMinutes(end);
    this.endTime.setHours(hm.hours, hm.minutes, 0, 0);
    this.color = task.color;
    this.hasLunchTime = false;
    this.workTime = [0, 24];
    this._dayIndex = 0;
  }

  get start(): number {
    if (this.startTime) {
      return this.startTime.getHours() + this.startTime.getMinutes() / 60;
    } else {
      return 0;
    }
  }
  set start(time: number): void {
    if (this.startTime) {
      const hm = hoursAndMinutes(time);
      this.startTime.setHours(hm.hours, hm.minutes, 0, 0);
    }
  }
  get end(): number {
    if (this.endTime) {
      return this.endTime.getHours() + this.endTime.getMinutes() / 60;
    } else {
      return 0;
    }
  }
  set end(time: number): void {
    if (this.endTime) {
      const hm = hoursAndMinutes(time);
      this.endTime.setHours(hm.hours, hm.minutes, 0, 0);
    }
  }
  get dayIndex(): number {
    return this._dayIndex;
  }
  set dayIndex(dayIndex: number) {
    if (this.startTime) {
      const firstDay = this.startTime.getDate() - this._dayIndex;
      this.startTime.setDate(firstDay + dayIndex);
    }
    if (this.endTime) {
      const firstDay = this.endTime.getDate() - this._dayIndex;
      this.endTime.setDate(firstDay + dayIndex);
    }
    this._dayIndex = dayIndex;
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
    let hm = hoursAndMinutes(duration);
    return hm.hours.toString().padStart(2, '0') + ':' + hm.minutes.toString().padStart(2, '0');
  }
}

export type WeekWorkOption = {
  daysPerWeek: number,
  hasLunchTime: boolean,
  lunchTime: LunchTime,
  startTime: number,
  endTime: number,
  defaultWorkDuration: number
}

export class WeekWork {
  day: Date
  settings: WeekWorkOption
  works: Work[]

  constructor(day: Date = new Date(), options?: any) {
    this.day = day;
    this.day.setHours(0, 0, 0, 0);
    const defaultOptions: WeekWorkOption = {
      daysPerWeek: 5,
      hasLunchTime: true,
      lunchTime: { start: 13, end: 14 },
      startTime: 8,
      endTime: 19,
      defaultWorkDuration: 4
    };
    if (options) {
      this.settings = Object.assign(defaultOptions, ...options);
    } else {
      this.settings = Object.assign(defaultOptions);
    }
    this.works = [];
  }

  addWork(day: number, work: Work): Work {
    return WeekWork.addWeekWork(this, day, work);
  }

  static addWeekWork(weekWork: WeekWork, day: number | Date, work: Work): Work {
    WeekWork.attach(weekWork, day, work);

    let dayIndex = work.dayIndex;
    if (0 <= dayIndex && dayIndex < weekWork.settings.daysPerWeek) {
      weekWork.works.push(work);
      WeekWork.fixWork(weekWork.works, work);
    }
    return work;
  }

  static attach(weekWork: WeekWork, dayIndex: number, work: Work) {
    const { hasLunchTime, lunchTime, startTime, endTime } = weekWork.settings;
    work.hasLunchTime = hasLunchTime;
    work.lunchTime = lunchTime;
    work.workTime = [startTime, endTime];
    work.dayIndex = dayIndex;
    const workDay = new Date(weekWork.day);
    workDay.setDate(weekWork.day.getDate() + dayIndex);
    let hm = hoursAndMinutes(work.start);
    const workStartTime = new Date(workDay);
    workStartTime.setHours(hm.hours, hm.minutes, 0, 0);
    work.startTime = workStartTime;
    hm = hoursAndMinutes(work.end);
    const workEndTime = new Date(workDay);
    workEndTime.setHours(hm.hours, hm.minutes, 0, 0);
    work.endTime = workEndTime;
    return work;
  }

  static fixWork(works: Work[], work: Work) {
    // sort works
    WeekWork.sortWorks(works);
    // get position of work in the array
    const index = works.findIndex(w => w.id === work.id);
    // the newly inserted/updated work must start after the previous one finishes (if any)
    if (index > 0) {
      const previousWork = works[index - 1];
      if (work.startTime < previousWork.endTime) {
        // shift the work
        const shift = previousWork.end - work.start;
        work.start = previousWork.end;
        work.end += shift;
      }
    }
    // the newly inserted/updated must end before the next one begins
    if (index + 1 < works.length) {
      const nextWork = works[index + 1];
      if (work.endTime > nextWork.startTime) {
        work.end = nextWork.start;
      }
    }
    if (work.start >= work.end) {
      throw new Error('invalid work. start >= end');
    }
  }
  static sortWorks(works: Work[]): Work[] {
    works.sort((a, b) => {
      if (a.startTime === b.startTime) {
        return a.endTime - b.endTime;
      } else {
        return a.startTime - b.startTime;
      }
    });
    return works;
  }
}