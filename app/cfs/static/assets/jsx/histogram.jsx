/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');


var hist_component = require('./hist_component.js');


module.exports = React.createClass({
    
    propTypes: {
        data: React.PropTypes.array,
        margins: React.PropTypes.object,
    },

    getDefaultProps: function() {
        return {
            margins: {
                    top: 20,
                    right: 20,
                    bottom: 30,
                    left: 20
                    },
            height: 500,
            width:  600,
        };
    },

    componentDidMount: function() {
        var el = ReactDOM.findDOMNode(this);
        hist_component.create(el, this.props, this.getHistogramState());
    },

    componentDidUpdate: function() {
        var el = ReactDOM.findDOMNode(this);
        console.log(this.props);
        if(!this.props.data.length) {
            hist_component.clear(el);
        } else {
            hist_component.update(el, this.props, this.getHistogramState());
        }
    },

    getHistogramState: function() {
        var props = this.props;
        var margins = props.margins;
        var width = props.width - margins.right - margins.left,
            height = props.height - margins.top - margins.bottom;

        return {
            data: this.props.data,
            width: width,
            height: height,
        };
    },

    componentWillUnmount: function() {
        var el = ReactDOM.findDOMNode(this);
        hist_component.destroy(el);
    },



    render: function() {
        console.log("rendering histogram");

        return (
        <div className="Histogram col-md-6"></div>
        );

    },

});
