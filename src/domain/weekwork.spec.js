import { WeekWork, Work, Task, Project } from './WeekWork';
import faker from 'faker';

describe('work adjustments', () => {
  const projects = [];
  let weekWork = {};
  const allTasks = [];

  beforeAll(() => {
    faker.seed(1);
    for (let i = 0; i < 5; i++) {
      const project = new Project(faker.random.word(), faker.lorem.words());
      for (let t = 0; t < 10; t++) {
        const task = new Task(faker.random.word(), faker.lorem.words(), faker.internet.color());
        project.addTask(task);
      }
      projects.push(project);
    }

    projects.forEach(p => p.tasks.forEach(t => allTasks.push(t)));
  });

  beforeEach(() => {
    weekWork = new WeekWork(new Date(2018, 7, 20));
    weekWork.addWork(0, Work.valueOf(allTasks[0], 8, 9));
    weekWork.addWork(0, Work.valueOf(allTasks[1], 9, 11.25));
    weekWork.addWork(0, Work.valueOf(allTasks[2], 14, 18));
    weekWork.addWork(1, Work.valueOf(allTasks[3], 8, 18));
    weekWork.addWork(4, Work.valueOf(allTasks[0], 8, 9));
    weekWork.addWork(4, Work.valueOf(allTasks[1], 9, 11.25));
    weekWork.addWork(4, Work.valueOf(allTasks[0], 13, 18));
  });

  test('should should overlay existing works', () => {
    let work = Work.valueOf(allTasks[0], 11, 15);
    work = weekWork.addWork(0, work);
    expect(work.start).toBe(11.25);
    expect(work.end).toBe(14);
  });

  test('should throw an error when new work overlays existing works', () => {
    function addWork() {
      let work = Work.valueOf(allTasks[0], 8.25, 9.5);
      work = weekWork.addWork(0, work);
    }
    expect(addWork).toThrowError('invalid work. start >= end');
  });
});
