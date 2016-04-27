/** @jsx React.DOM */



var React = require('react');
var ReactDOM = require('react-dom');

var d3Component = require('./d3_component.js');

module.exports = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    chloropethType: React.PropTypes.string,
  },

  getDefaultProps : function() {
        return  {
          width: 900,
          height: 650,
          projection: d3.geo.albersUsa()
      };
    },


    // create the dom element
  componentDidMount: function() {
    console.log("mapstate", this.getMapState());
    var el = ReactDOM.findDOMNode(this);
    d3Component.create(el, this.props,  this.getMapState());
  },


    // update the dom element
  componentDidUpdate: function() {
    console.log("Updating map component");
    var el = ReactDOM.findDOMNode(this);
    d3Component.update(el, this.props, this.getMapState());
    
  },


  getMapState: function() {
    return {
      data: this.props.data,
      currentState: this.props.current_state,
      chloropethType: this.props.chloropethType,
    };
  },

    // delete d3
  componentWillUnmount: function() {
    var el = ReactDOM.findDOMNode(this);
    d3Component.destroy(el);
  },

  render: function() {
    console.log("rendering map");
    return (
      <div className="Map"></div>
    );
  }
});
