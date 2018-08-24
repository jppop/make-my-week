import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import Color from "color";

// see https://github.com/bokuweb/react-rnd
export class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workItem: props.workItem,
      width: props.width,
      x: props.x,
      y: props.y
    };
  }

  static propTypes = {
    workItem: PropTypes.object.isRequired,
    unit: PropTypes.arrayOf(PropTypes.number).isRequired,
    color: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dragSizeIncrement: PropTypes.number,
    maxWidth: PropTypes.number,
    boundsSelector: PropTypes.string,
    onWorkItemUpdate: PropTypes.func
  };

  static defaultProps = {
    color: "crimson",
    x: 0,
    y: 0,
    width: 100,
    height: "auto",
    dragSizeIncrement: 1,
    maxWidth: undefined,
    boundsSelector: undefined
  };

  render() {
    let color = Color(this.props.color);
    const style = {
      backgroundColor: this.props.color,
      color: color.isDark() ? "white" : "black",
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
          this.setState({
            width: this.state.width + d.width
          });
        }}
        onResize={(e, direction, ref, d, position) => {
          let width = ref.offsetWidth;
          let duration = width / this.props.unit[0];
          // round duration up to the nearest quater of hour
          duration = Math.ceil((duration*100)/25.0) * 25 / 100;
          let workItem = Object.assign(Object.create(Object.getPrototypeOf(this.state.workItem)), this.state.workItem);
          workItem.end = workItem.start + duration;
          if (this.props.onWorkItemUpdate) {
            let newWorkItem = this.props.onWorkItemUpdate(workItem);
            if (newWorkItem) {
              workItem = newWorkItem;
            }
          }
          this.setState({
            workItem: workItem
          });
        }}
        onDragStop={(e, data) => {
          let workItem = Object.assign(Object.create(Object.getPrototypeOf(this.state.workItem)), this.state.workItem);
          const duration = workItem.duration();
          workItem.start = workItem.workTime[0] + (data.lastX / this.props.unit[0]);
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
      >
        {this.state.workItem.durationAsString()}
      </Rnd>
    );
  }
}

export default Bar;
