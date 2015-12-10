/** @jsx React.DOM */

//http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

var React = require('react');

var Chart = require('./chart.jsx')

var sampleData = [
      {id: '5fbmzmtc', x: 7, y: 41, z: 6},
      {id: 's4f8phwm', x: 11, y: 45, z: 9}
];


module.exports = React.createClass({
          getInitialState: function() {
            return {
                  data: sampleData,
                  domain: {x: [0, 30], y: [0, 100]}
            };
      },


        render: function() {
            return (
                <div>
                <h2>This is the App component</h2>
                <div className='row'>
                    <section id="tool-bar" className="col-md-3">
                        <h2 className="btn btn-default">button</h2> 
                    </section>

                    <section id="chart" className="col-md-9">
                        <Chart data={this.state.data}
                                domain={this.state.domain} />
                    </section>
                        
                </div>
                </div>
                
            )
        }
    
})
