import React from 'react';
import { shallow, mount, render } from 'enzyme';
import TimeBar from '../TimeBar';

import { WorkWeek, Work, Task, Project } from '../../domain/WeekWork';
import { Rnd } from 'react-rnd';

let project = null;
let workItem = null;

beforeAll(() => {
  project = new Project('PRJ1', 'Make my week');
  const task = new Task('T01', 'Task #01', 'steelblue');
  project.addTask(task);
});

// eslint-disable-next-line
function Fixture({ workItem, onWorkItemUpdate, contextMenuHandler, dragStartHandler, dragStopHandler }) {
  const quarterWidth = 4;
  const settings = {
    cellWidth: quarterWidth * 4 + 2,
    cellHeight: 14,
    maxWidth: 11 * (quarterWidth * 4 + 2),
    startTime: 8,
    endTime: 19
  };
  const styles = {
    container: {
      position: 'relative',
      fontFamily: '\'Roboto\', sans-serif',
      fontSize: 12,
      zIndex: 0
    },
    bounds: lines => {
      return {
        position: 'absolute',
        left: 0,
        top: (settings.cellHeight + 2) * 2,
        height: (settings.cellHeight + 2) * lines - 2,
        maxHeight: (settings.cellHeight + 2) * lines - 2,
        width: (settings.cellWidth + 2) * (settings.endTime - settings.startTime) - 1,
        maxWidth: (settings.cellWidth + 2) * (settings.endTime - settings.startTime) - 1,
        zIndex: 2,
        pointerEvents: 'auto',
        cursor: 'crosshair',
        backgroundColor: 'white'
      };
    }
  };
  return (
    <div style={styles.container}>
      <div id="bounds" style={styles.bounds(1)}>
        <TimeBar
          workItem={workItem}
          unit={[settings.cellWidth + 2, settings.cellHeight + 2]}
          key={'work#' + workItem.id.work}
          boundsSelector="#bounds"
          dragSizeIncrement={settings.quarterWidth}
          maxWidth={settings.maxWidth}
          x={(settings.cellWidth + 2) * (workItem.start - settings.startTime)}
          y={(settings.cellHeight + 2) * workItem.dayIndex}
          width={(settings.cellWidth + 2) * workItem.duration() - 1}
          color={workItem.color}
          onWorkItemUpdate={onWorkItemUpdate}
          contextMenuHandler={workItem => contextMenuHandler(workItem)}
          onDragStart={(e, data) => dragStartHandler(e, data)}
          onDragStop={(e, data) => dragStopHandler(e, data)}
        />
      </div>
    </div>
  );
}

describe('rendering', () => {
  test('bar is rendered with the work duration and color', () => {
    let task = project.getTask('T01');
    expect(task).not.toBeNull();
    let workItem = Work.valueOf(task, 9, 18);
    const wrapper = mount(
      Fixture({
        workItem: workItem
      })
    );
    // console.log(wrapper.debug());
    expect(wrapper.find(TimeBar)).toHaveLength(1);
    const barNode = wrapper.find(TimeBar).first();
    expect(barNode.props().color).toBe(workItem.color);
    expect(barNode.html()).toContain('span');
    expect(barNode.find('span')).toHaveLength(2);
    expect(
      barNode
        .find('span')
        .first()
        .text()
    ).toBe(workItem.durationAsString());
  });
});
describe('event', () => {
  xtest('bar call drag callbacks', () => {
    let task = project.getTask('T01');
    expect(task).not.toBeNull();
    let workItem = Work.valueOf(task, 9, 18);
    const dragStartSpy = jest.fn();
    const dragStopSpy = jest.fn();
    const onWorkItemUpdateSpy = jest.fn();
    const wrapper = mount(
      Fixture({
        workItem: workItem,
        dragStartHandler: dragStartSpy,
        dragStopHandler: dragStopSpy,
        onWorkItemUpdate: onWorkItemUpdateSpy
      })
    );
    expect(wrapper.find(TimeBar)).toHaveLength(1);
    const barNode = wrapper.find(TimeBar).first();
    barNode.simulate('mousedown', { clientX: 0, clientY: 0 });
    barNode.simulate('mouseup', { clientX: 1, clientY: 1 });
    expect(dragStartSpy).toBeCalled();
    expect(dragStopSpy).toBeCalled();
    expect(onWorkItemUpdateSpy).toBeCalled();
  });
  test('bar call contextmenu callbacks', () => {
    let task = project.getTask('T01');
    expect(task).not.toBeNull();
    let workItem = Work.valueOf(task, 9, 18);
    const contextMenuHandlerSpy = jest.fn();
    const wrapper = mount(
      Fixture({
        workItem: workItem,
        contextMenuHandler: contextMenuHandlerSpy
      })
    );
    expect(wrapper.find(TimeBar)).toHaveLength(1);
    const barNode = wrapper.find(TimeBar).first();
    const spanNodes = barNode.find('span');
    expect(spanNodes).toHaveLength(2);
    spanNodes.first().simulate('contextmenu', { clientX: 0, clientY: 0 });
    expect(contextMenuHandlerSpy).toBeCalled();
  });
});
