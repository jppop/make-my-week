import { WeekWork, Work, Task, Project } from './WeekWork';
import faker from 'faker';

describe('work adjustments', () => {
  const projects = [];
  let weekWork = {};

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

    weekWork = new WeekWork(new Date(2018, 7, 20));
    weekWork.addWork(0, Work.valueOf(projects[0].tasks[0], 8, 9));
    weekWork.addWork(0, Work.valueOf(projects[0].tasks[1], 9, 11.25));
    weekWork.addWork(0, Work.valueOf(projects[1].tasks[0], 14, 18));
    weekWork.addWork(new Date(2018, 7, 21), Work.valueOf(projects[0].tasks[0], 8, 18));
    weekWork.addWork(4, Work.valueOf(projects[0].tasks[0], 8, 9));
    weekWork.addWork(4, Work.valueOf(projects[0].tasks[1], 9, 11.25));
    weekWork.addWork(4, Work.valueOf(projects[1].tasks[0], 13, 18));

    const allTasks = [];
    projects.forEach(p => p.tasks.forEach(t => allTasks.push(t)));
  });

  test('should should overlay existing works', () => {
    let work = Work.valueOf(projects[0].tasks[0], 11, 15);
    work = weekWork.addWork(0, work);
    expect(work.start).toBe(11.25);
    expect(work.end).toBe(14);
  });
});
