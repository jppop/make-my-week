import { ProjectManager, WeekWork, Work, Task, Project } from './WeekWork';
import faker from 'faker';
import { completeAssign } from '../utils/tools';

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
    let work = projectManager.addWork(projectId, tasks[3].id, 0, 11, 15);
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
    // add 1-hour work
    work = projectManager.addWork(projectId, tasks[0].id, 2, 8, 9);
    // continue work (+2.25), no pause
    work = projectManager.addWork(projectId, tasks[0].id, 2, 9, 11.25);
    expectedDuration += work.duration(true);
    // continue again (+3), with a pause
    work = projectManager.addWork(projectId, tasks[0].id, 2, 15, 18);
    expectedDuration += work.duration(true);
    // nex day, continue (+4)
    work = projectManager.addWork(projectId, tasks[0].id, 3, 8, 12);
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

  test('should be cloned', () => {
    const workA = new Work('P1', 'T01', 'W01', 8, 12, 'Task #01', 'blue');
    const startTime = workA.startTime;
    // console.log(workA);
    // console.log(startTime);
    const workB = workA.clone();
    startTime.setDate(startTime.getDate() + 1);
    // console.log(workA);
    // console.log(startTime);
    // console.log(workB);
    expect(workA).not.toBe(workB);
    expect(workA).toEqual(workB);
    expect(workA.startTime).not.toEqual(startTime);
    expect(workB.startTime).not.toEqual(startTime);
  });
});
