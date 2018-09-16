import { ProjectManager, WeekWork, Work, Task, Project } from './WeekWork';
import faker from 'faker';

describe('work adjustments', () => {
  let projectManager = null;

  beforeEach(() => {
    faker.seed(1);
    projectManager = new ProjectManager();
    for (let i = 0; i < 5; i++) {
      const projectId = faker.random.word();
      projectManager.addProject(projectId, faker.lorem.words());
      for (let t = 0; t < 10; t++) {
        projectManager.addTask(projectId, faker.random.word(), faker.lorem.words(), faker.internet.color());
      }
    }
  });

  test('should overlay existing works', () => {
    const projectId = projectManager.projects[0].id;
    const tasks = projectManager.getTasks(projectId);
    projectManager.addWork(projectId, tasks[0].id, 0, 8, 9);
    projectManager.addWork(projectId, tasks[1].id, 0, 9, 11.25);
    projectManager.addWork(projectId, tasks[2].id, 0, 14, 18);
    let work = projectManager.addWork(projectId, tasks[2].id, 0, 11, 15);
    expect(work.start).toBe(11.25);
    expect(work.end).toBe(14);
  });

  test('should throw an error when new work overlays existing works', () => {
    function addWorks() {
      const projectId = projectManager.projects[0].id;
      const tasks = projectManager.getTasks(projectId);
      projectManager.addWork(projectId, tasks[0].id, 1, 8, 9);
      projectManager.addWork(projectId, tasks[1].id, 1, 9, 11.25);
      // the next line should not be possible
      projectManager.addWork(projectId, tasks[2].id, 1, 8.25, 10);
    }
    expect(addWorks).toThrowError('invalid work. start >= end');
  });

  test('should update completed count', () => {
    const projectId = projectManager.projects[0].id;
    const tasks = projectManager.getTasks(projectId);
    let expectedDuration = tasks[0].completed;
    let work;
    work = projectManager.addWork(projectId, tasks[0].id, 0, 8, 9);
    expectedDuration += work.duration(true);
    work = projectManager.addWork(projectId, tasks[0].id, 0, 9, 11.25);
    expectedDuration += work.duration(true);
    work = projectManager.addWork(projectId, tasks[0].id, 0, 15, 18);
    expectedDuration += work.duration(true);

    expect(expectedDuration).toBe(tasks[0].completed);

    // update last work (+1/2 hours)
    expectedDuration += 0.5;
    work.start = work.start - 0.25;
    work.end = work.end + 0.25;
    work = projectManager.updateWork(work);

    expect(expectedDuration).toBe(tasks[0].completed);

    // remove last work
    expectedDuration -= work.duration(true);
    projectManager.deleteWork(work.id.work);
    expect(expectedDuration).toBe(tasks[0].completed);
  });
});
