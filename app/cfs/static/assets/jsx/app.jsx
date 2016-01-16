/** @jsx React.DOM */


var React = require('react');

var Map = require('./map.jsx');

var ToolBar = require('./toolbar.jsx');

var Pie     = require('./pie.jsx');

var Histogram = require('./histogram.jsx');


module.exports = React.createClass({
        propTypes: {
            showStateLabels: React.PropTypes.bool,
        },

        getInitialState: function() {
            return {
                  data: [],
                  showStateLabels: false,
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

        getSCTGData: function() {
            var suffix = this.state.current_state.join("/");
            var url = this.props.get_data_url+ suffix+"/info/SCTG/break_down";
            //console.log(url);
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({scgtData: data});
                }.bind(this),
            });
        },

        getMODEData: function() {
            var suffix = this.state.current_state.join("/");
            var url = this.props.get_data_url+suffix+"/info/MODE/break_down";
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({modeData: data});
                }.bind(this),
            });
        }, 
        
        getNAICSData: function() {
            var suffix = this.state.current_state.join("/");
            var url = this.props.get_data_url+suffix+"/info/NAICS/break_down";
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({naicsData: data});
                }.bind(this),
            });
        }, 

        getQuarterData: function() {
            var suffix = this.state.current_state.join("/");
            var url = this.props.get_data_url+suffix+"/info/QUARTER/counts";
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({quarterData: data});
                }.bind(this),
            });
        },

        getHazmatData: function() {
            var suffix = this.state.current_state.join("/");
            var url    = this.props.get_data_url+suffix+"/info/HAZMAT/counts";
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.setState({hazmatData: data});
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

            this.getSCTGData();
            this.getNAICSData();
            this.getMODEData();
            this.getQuarterData();
            this.getHazmatData();

        },

        handleStateSelect: function(new_state) {
            //console.log("In handle state with args: ", new_state);
        
            // if the user selected 2 states already clear the selection
            // and add a new state in
            if (this.state.current_state.length >= 2) {
                this.state.current_state = [new_state];
            } else {
                this.state.current_state.push(new_state);
            }
                
            //console.log(this.state);
            this.updateStateData();

//            if (this.state.current_state.length === 2) {
                this.getAllData();
 //           }
        },

        handleClear: function() {
            //console.log("Handling clear");
            this.replaceState({
                data: [],
                current_state: [],
                scgtData: [],
                modeData: [],
                naicsData: [],
                shipmentValueData: [],
                weightData: [],
                quarterData: [],
                hazmatData:  [],
            });

        },



        render: function() {
            //console.log(this.state);
            return (
                <div className="container">
                <div className='row' id="toolbar">
                    <ToolBar handleClear={this.handleClear} />
                </div>
                <div className="row">
                    <section id="chart" className="col-md-12">
                        <Map url={this.props.get_data_url} 
                             data={this.state.data} 
                            current_state={this.state.current_state}
                            handle_state={this.handleStateSelect}
                        />
                    </section>
                </div>
                <section id="pie-chart" className="row">

                    <Pie     data    = {this.state.scgtData}
                             title="SCTG" />
                    <Pie     data    = { this.state.modeData}
                             title="MODE" />
                    <Pie     data    = { this.state.naicsData}
                             title="NAICS" />
                    <Pie     data    = { this.state.quarterData}
                             title="Quarter" />
                    <Pie     data    = { this.state.hazmatData}
                             title="HazMat" />
                              
                    
                </section>
                <section id="histograms" className="row">

                    <Histogram  data = {this.state.shipmentValueData}
                                title="Values" />

                    <Histogram  data = {this.state.weightData}
                                title="Weights" />
                        
                </section>

                
                </div>
                
            )
        }
    
})
