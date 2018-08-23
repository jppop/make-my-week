import React, { Component } from "react";
import PropTypes from "prop-types";
import { Rnd } from "react-rnd";
import Color from "color";

// see https://github.com/bokuweb/react-rnd
export class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      width: props.width,
      x: props.x
    }
  }

  static propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dragSizeIncrement: PropTypes.number,
    maxWidth: PropTypes.number,
    boundsSelector: PropTypes.string
  };

  static defaultProps = {
    color: "crimson",
    text: "",
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
      color: color.isDark() ? "white" : "black"
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
        // onResize={(e, direction, ref, d, position) => {
        //     this.setState({
        //         text: this.state.width + d.width,
        //     });
        // }}
        onDragStop={(e, data) => {
          console.log(data)
           this.setState({
             x: data.lastX
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
        {this.state.text}
      </Rnd>
    );
  }
}

export default Bar;
