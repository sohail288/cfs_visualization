/** @jsx React.DOM */


var React = require('react');

var Map = require('./map.jsx');

var ToolBar = require('./toolbar.jsx');

var Pie     = require('./pie.jsx');

var Histogram = require('./histogram.jsx');


module.exports = React.createClass({
        propTypes: {
            showStateLabels: React.PropTypes.bool,
            chloroOptions:   React.PropTypes.array,
        },

        getInitialState: function() {
            return {
                  data: [],
                  showStateLabels: false,
                  chloropethActive: false,
                  chloropethType:     "",
                  current_state: ['KS'],
                  scgtData:       [],
                  modeData:       [],
                  naicsData:      [],
                  shipmentValueData:   [],
                  weightData: [],
                  quarterData: [],
                  hazmatData:  [],
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
            var suffix = this.state.current_state.join("/");
            $.ajax({
                url: this.props.get_data_url+suffix,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({data: data});
                    this.getShipmentValueData();
                    this.getWeightData();
                }.bind(this),
            });
        },


        getData: function(ep_url, data_name) {
            var suffix = this.state.current_state.join("/");
            var url    = this.props.get_data_url+suffix+ep_url;
            var newstate = {};
            $.ajax({
                url: url,
                dataType: 'json',
                cache: true,
                success: function(data) {
                    newstate[data_name] = data;
                    this.setState(newstate);
                }.bind(this),
            });
        },



        componentDidMount: function() {
            this.updateStateData();
            this.getAllData();
            
        },

        getShipmentValueData: function () {
            var values = !this.state.data.length ? [] : this.state.data.map((d)=>d.SHIPMT_VALUE);
            this.setState({shipmentValueData: values});
                

        },

        getWeightData: function () {
            weights = !this.state.data.length ? [] : this.state.data.map((d)=>d.SHIPMT_WGHT);
            this.setState({weightData: weights});

        },


        displayStateLabels: function() {
            //console.log("Displaying labels");
        },

        getAllData: function() {

            this.getData('/info/SCTG/break_down', 'scgtData');
            this.getData('/info/NAICS/break_down', 'naicsData');
            this.getData('/info/MODE/break_down', 'modeData');
            this.getData('/info/QUARTER/counts', 'quarterData');
            this.getData('/info/HAZMAT/counts', 'hazmatData'); 

        },

        handleStateSelect: function(new_state) {
        
            // if the user selected 2 states already clear the selection
            // and add a new state in
            if (this.state.current_state.length >= 2) {
                this.state.current_state = [new_state];
            } else {
                this.state.current_state.push(new_state);
            }
                
            this.updateStateData();

            this.getAllData();
        },

        handleClear: function() {
            //console.log("Handling clear");
            var init_state = this.getInitialState();
            init_state['current_state'] = [];
            this.replaceState(init_state);

        },

        handleChloropethSelect: function(option) {
            if (option !== this.state.chloropethType) {
                this.setState({
                    chloropethType: option,
                    chloropethActive: true,
                });
            }
        },


        render: function() {
            //console.log(this.state);
            return (
                <div className="container">
                <div className='row' id="toolbar">
                    <ToolBar handleClear={this.handleClear} 
                             handleChloropethSelect={this.handleChloropethSelect}
                             chloroOptions={this.props.chloroOptions}
                    />
                </div>
                <div className="row">
                    <section id="chart" className="col-md-12">
                        <Map url={this.props.get_data_url} 
                             data={this.state.data} 
                            current_state={this.state.current_state}
                            handle_state={this.handleStateSelect}
                            chloropethType={this.state.chloropethType}
                        />
                    </section>
                </div>
                <section id="pie-chart" className="row">

                    <Pie     data    = {this.state.scgtData}
                             current_state = {this.state.current_state}
                             title="SCTG" />
                    <Pie     data    = { this.state.modeData}
                             current_state = {this.state.current_state}
                             title="MODE" />
                    <Pie     data    = { this.state.naicsData}
                             current_state = {this.state.current_state}
                             title="NAICS" />
                    <Pie     data    = { this.state.quarterData}
                             current_state = {this.state.current_state}
                             title="Quarter" />
                    <Pie     data    = { this.state.hazmatData}
                             current_state = {this.state.current_state}
                             title="HazMat" />
                              
                    
                </section>

                <section id="histograms" className="row">

                    <Histogram  data = {this.state.shipmentValueData}
                                width={500}
                                title="Values" />

                    <Histogram  data = {this.state.weightData}
                                width={500}
                                title="Weights" />
                        
                </section>

                
                </div>
                
            )
        }
    
})
