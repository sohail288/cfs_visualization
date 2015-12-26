/** @jsx React.DOM */

//http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

var React = require('react');

var Map = require('./map.jsx');

var ToolBar = require('./toolbar.jsx');


module.exports = React.createClass({
        propTypes: {
            showStateLabels: React.PropTypes.bool,
        },

        getInitialState: function() {
            return {
                  data: [],
                  showStateLabels: false,
                  current_state: 'KS'
            };
      },
        
        getTestData: function() {
            $.ajax({
                url: this.props.get_data_url+"CA",
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({data: data});
                }.bind(this),
            });
        },
        
        updateStateData: function() {
            $.ajax({
                url: this.props.get_data_url+this.state.current_state,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({data: data});
                }.bind(this),
            });
        },

        
        
        componentDidMount: function() {
            this.updateStateData();
        },


        displayStateLabels: function() {
            console.log("Displaying labels");
        },

        handleStateSelect: function(new_state) {
            console.log("In handle state with args: ", new_state);
            this.state.current_state = new_state; 
            console.log(this.state);
            this.updateStateData();
        },
        

        

        render: function() {
            return (
                <div>
                <h2>This is the App component</h2>
                <div className='row'>
                    <section id="tool-bar" className="col-md-3">
                        <ToolBar />
                    </section>

                    <section id="chart" className="col-md-9">
                        <Map url={this.props.get_data_url} 
                             data={this.state.data} 
                            current_state={this.state.current_state}
                            handle_state={this.handleStateSelect}
                        />
                    </section>
                        
                </div>
                </div>
                
            )
        }
    
})
