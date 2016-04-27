var React = require("react");
var ReactDOM = require("react-dom");
var pieComponent = require("./pie_component.js");

// draws a pie chart


module.exports = React.createClass({

    propTypes: {
        data: React.PropTypes.array,
    }, 

    getDefaultProps: function() {
        return {
            height: 300,
            width: 300,
            margins: {
                    top: 15,
                    right: 70,
                    bottom: 30,
                    left: 20,
                    },
        }
    },

    componentDidMount: function() {
        // create the pie chart
        var el = ReactDOM.findDOMNode(this);
        pieComponent.create(el, this.props, this.getPieState());

    },

    componentDidUpdate: function() {
        // update the pie
        var el = ReactDOM.findDOMNode(this);
        if (this.props.data.length === 0) {
            pieComponent.clear(el);
        } else {
            pieComponent.update(el, this.props, this.getPieState());
        }

    },

    shouldComponentUpdate: function(nextProps, nextState) {
        var scu = false;
        var newkeys = Object.keys(nextProps.data);
        console.info(Object.keys(nextProps.data));
        console.info(nextProps.data);

        if (!nextProps.data.length) {
            return true;
        }

        newkeys.forEach(function(k,i) {
            
            if (nextProps.data[k] !== this.props.data[k]) {
                scu = true;
            }
        }.bind(this));

        return scu;
    },

    getPieState: function () {
       return {
            radius: Math.min(this.props.width, this.props.height) / 2,
            data:  this.props.data,

        }
    },



    componentWillUnmount: function() {
        // destroy the component
        var el = ReactDOM.findDOMNode(this);
        pieComponent.destroy(el);

    },


    render: function() {
        console.log("rendering pie");
        console.log(this.props.data);
        return (
            <div className="Pie col-md-4"></div>
        );
      }

});
