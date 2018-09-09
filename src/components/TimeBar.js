// @flow
import * as React from 'react';
import { Rnd } from 'react-rnd';
import Color from 'color';
import { Work } from '../domain/WeekWork';
import Log from '../Log';

// see https://github.com/bokuweb/react-rnd

type Props = {
  /** Description of workItem */
  workItem: Work,
  unit: number[],
  color: string,
  x: number,
  y: number,
  width: number,
  height: number | string,
  dragSizeIncrement: number,
  maxWidth: number,
  boundsSelector: string,
  onWorkItemUpdate: Work => Work,
  contextMenuHandler: Work => Work,
  onDragStart: (Event, Work) => void,
  onDragStop: (Event, Work) => void
}

type State = {
  workItem: Work,
  width: number,
  x: number,
  y: number
}

/**
 * A time bar resizable and draggable.
 *
 * @export
 * @class Bar
 * @extends {React.Component<Props, State>}
 */
export class TimeBar extends React.Component<Props, State> {
  static defaultProps = {
    color: 'crimson',
    x: 0,
    y: 0,
    width: 100,
    height: 'auto',
    dragSizeIncrement: 1,
    maxWidth: undefined,
    boundsSelector: undefined,
    onWorkItemUpdate: () => {},
    contextMenuHandler: () => {},
    onDragStart: () => {},
    onDragStop: () => {}
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      workItem: props.workItem,
      width: props.width,
      x: props.x,
      y: props.y
    };
  }

  render() {
    let color = Color(this.props.color);
    const style = {
      backgroundColor: this.props.color,
      color: color.isDark() ? 'white' : 'black'
    };

    const Duration = props => {
      const duration = props.workItem.duration(true);
      const hour = Math.trunc(duration);
      const minutes = (duration - hour) * 60;
      const durationAsString = hour.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');

      return <span>{durationAsString}</span>;
    };

    return (
      <Rnd
        style={style}
        default={{
          x: this.state.x,
          y: this.props.y,
          width: this.state.width,
          height: this.props.height
        }}
        onResizeStop={(e, direction, ref, d, position) => {
          let newState = { width: this.state.width + d.width, workItem: undefined };
          if (this.props.onWorkItemUpdate) {
            let newWorkItem = this.props.onWorkItemUpdate(this.state.workItem);
            if (newWorkItem) {
              newState.workItem = newWorkItem;
            }
          }
          this.setState(newState);
        }}
        onResize={(e, direction, ref, d, position) => {
          let width = ref.offsetWidth;
          let duration = width / this.props.unit[0];
          // round duration up to the nearest quater of hour
          duration = (Math.ceil((duration * 100) / 25.0) * 25) / 100;
          let workItem = this.state.workItem.clone();
          workItem.end = workItem.start + duration;
          this.setState({
            workItem: workItem
          });
        }}
        onDragStart={(e, data) => {
          e.stopPropagation();
          Log.trace({ event: e, data: data }, 'TimeBar::OnDragStart');
        }}
        onDragStop={(e, data) => {
          e.stopPropagation();
          Log.trace({ event: e, data: data }, 'TimeBar::OnDragStop');
          let workItem = this.state.workItem.clone();
          const duration = workItem.duration();
          workItem.start = workItem.workTime[0] + data.lastX / this.props.unit[0];
          workItem.end = workItem.start + duration;
          workItem.dayIndex = data.lastY / this.props.unit[1];
          if (this.props.onWorkItemUpdate) {
            let newWorkItem = this.props.onWorkItemUpdate(workItem);
            if (newWorkItem) {
              workItem = newWorkItem;
            }
          }
          this.setState({
            x: data.lastX,
            y: data.lastY,
            workItem: workItem
          });
        }}
        enableResizing={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
        }}
        dragAxis="both"
        dragGrid={[this.props.dragSizeIncrement, this.props.dragSizeIncrement]}
        resizeGrid={[this.props.dragSizeIncrement, this.props.dragSizeIncrement]}
        maxHeight="auto"
        maxWidth={this.props.maxWidth}
        bounds={this.props.boundsSelector}
        onContextMenu={this.onContextMenu}
      >
        <Duration workItem={this.state.workItem} />
      </Rnd>
    );
  }
  onContextMenu = (e: SyntheticMouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.props.contextMenuHandler(this.state.workItem);
  }
}

export default TimeBar;
