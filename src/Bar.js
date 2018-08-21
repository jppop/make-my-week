import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';

// see https://github.com/bokuweb/react-rnd
export class Bar extends Component {

    constructor(props) {
        super(props);
        this.state = props;
    }

    static defaultProps = {
        color: 'crimson',
        text: '',
        x: 0,
        y: 0,
        width: 100,
        height: 'auto',
    }
    static propTypes = {
        color: PropTypes.string,
        text: PropTypes.string,
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
    };
    render() {
        const style = {
            backgroundColor: this.state.color,
            color: 'white',
        };
        return (
            <Rnd
                style={style}
                default={{
                    x: this.state.x,
                    y: this.state.y,
                    width: this.state.width,
                    height: this.state.height
                  }}
                onResizeStop={(e, direction, ref, d, position) => {
                    this.setState({
                        width: this.state.width + d.width,
                    });
                }}
                // onResize={(e, direction, ref, d, position) => {
                //     this.setState({
                //         text: this.state.width + d.width,
                //     });
                // }}
                onDragStop={(e, data) => {
                    var {x} = data;
                    console.log(data);
                    this.setState({
                        x: x,
                    });
                }}
                enableResizing={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                dragAxis='x'
                dragGrid={[61, 61]}
                resizeGrid={[61, 61]}
                >
                {this.state.text}
            </Rnd>
        )
    }
}

export default Bar;
