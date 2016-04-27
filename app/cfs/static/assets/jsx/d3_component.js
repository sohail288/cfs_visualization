// d3Chart.js

var d3Chart = {};
var topojson=require("topojson");

var chloropethRanges = {
    'hazmat': ['white', 'orange'],
    'number of shipments': ['white', 'blue'],
}


d3Chart.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'map')
      .attr('width', props.width)
      .attr('height', props.height);

    this._drawMap(el, props, state, svg);
    this.update(el, props,  state);
        
};


d3Chart._drawMap = function(el, props, state, svg) {
    var path = d3.geo.path().projection(props.projection);


    d3.json("/usa-map-data", function(error, map_json) {
        if (error) {
            return console.error(error);
        }
        
        svg.selectAll('.state')
            .data(topojson.feature(map_json, map_json.objects.states)
                   .features)
            .enter().append("path")
            .attr("id", (d) => d.properties['postal'])
            .attr("class", "state")
            .attr("d", path);

        svg.append("path")
            .datum(topojson.mesh(map_json, 
                                 map_json.objects.subunits,
                                 (a,b)=> a===b))
            .attr("d", path)
            .attr("class", "exterior-borders");

        svg.append("path", ".graticule")
           .datum(topojson.mesh(map_json, map_json.objects.states,
                                (a,b)=> a !== b))
            .attr("class", "state-borders")
            .attr("d", path);

        // add state labels

        // show state labels
        svg.selectAll(".state-label")
            .data(topojson.feature(map_json, map_json.objects.states).features)
            .enter().append("text")
            .attr("class", "state-label")
            .attr("transform", function (d) {
                var loc = path.centroid(d);
                loc[0] -= 30;
                return "translate("+loc+")";})
            .attr("dy", ".35em")
            .text((d)=>d.properties['state-name'])

        //create mouse over event for changing the current state api
        d3Chart._addClickableState(el, props);

    });
}

d3Chart.update = function(el, props, state) {
    //console.log(state);
    d3Chart._addTransactionLines(el, props, state);
    d3Chart._highlightStates(el, state);
    
}    

d3Chart.clear = function() {
    // remove state selects
    d3.selectAll(".state-select").classed({"state-select": false});

    // remove transaction lines
    d3.selectAll(".transaction-lines").remove();
    
}

d3Chart._addChloropeth = function(el, props, state) {
    var allStates = d3.select(el).selectAll('.state');
    var chloropethType = state.chloropethType;
    var chloropethData = state.chloropethData;

    var sel = d3.select(el).select('svg').selectAll(".state");

    var dataExtent = d3.extent(chloropethData.map((d) => d.quantity));
    

    var color = d3.scale.linear()
            .domain(dataExtent)
            .range(chloropethRanges[chloropethType]);

//    allStates.attr("fill", function(d,i) {
//        
//    
//    });
}


// I don't know how this works anymore...
d3Chart._addClickableState = function(el, props) {
    var sel = d3.select(el).select('svg').selectAll(".state");

    sel.on("click", function (d) {
        var new_state = d.properties["postal"]; 
        d3Chart.changeCurrentState(props.handle_state, new_state);
    
    }); 
};

d3Chart._highlightStates = function(el, state) {
    //console.log(state.currentState);
    d3.selectAll(".state-select").classed({"state-select": false});
    state.currentState.forEach (function(d) {
        d3.select("#"+d)
          .classed({"state-select": true})
    });
}

// this works in leui of an event emitter
d3Chart.changeCurrentState = function(handleChange, new_state) {
    handleChange(new_state); 
}

d3Chart._addTransactionLines = function(el, props, state) {
    d3.selectAll(".transaction-lines").remove();

    var sel = d3.select(el).select("svg").selectAll(".transaction-lines");

    var path = d3.geo.path().projection(props.projection);

    var getPointA = function (d) {
        return [d.orig_lon, d.orig_lat];
    }
    var getPointB = function (d) {
        return [d.dest_lon, d.dest_lat];
    }

    var getTransactions = function (data) {
        var curData = data; 
        
        // return a closure that takes in a state
        // and returns the number of transactions that are
        // between itself and other states
        return (d)=> curData.filter((d2) => d.ORIG_STATE==d2.ORIG_STATE && d.DEST_STATE == d2.DEST_STATE).length;
    };

    var domain = d3.extent(state.data, getTransactions(state.data));


    var lineWidthScale = d3.scale.linear().range([1,10]).domain(domain);

    var sameStateTransactions = state.data.filter(
                        (d)=> d.dest_alpha_code === d.orig_alpha_code);
    var fromStateTransactions = state.data.filter(
                        (d)=> d.dest_alpha_code !== d.orig_alpha_code);


    var enter = sel
        .data(fromStateTransactions)
        .enter();

    var getTransactions_ = getTransactions(fromStateTransactions);


    enter.append("line")
         .attr('class', 'transaction-lines')
         .attr('x1', (d)=> props.projection(getPointA(d))[0])
         .attr('y1', (d)=> props.projection(getPointA(d))[1])
        .attr('x2', (d)=> props.projection(getPointB(d))[0])
        .attr('y2', (d)=> props.projection(getPointB(d))[1])
        .style('stroke', 'green')
        .style('stroke-width', (d)=> lineWidthScale(getTransactions_(d)));


    // add circles for same state transactions
    sel
      .data(sameStateTransactions)
    .enter()
      .append("circle")
        .attr('class', 'transaction-lines')
                                                        // addf jitter
        .attr('cx', (d) => props.projection(getPointA(d))[0]+Math.random()*10)
        .attr('cy', (d) => props.projection(getPointA(d))[1]+Math.random()*10)
        .attr('r', 3)
        .style('stroke', 'yellow')
        .style('fill', 'red');
       
};

d3Chart.destroy = function(el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

d3Chart._showStateLabels = function (el, data, props ) {
    var path = d3.geo.path().projection(props.projection);

    var g = d3.select(el).selectAll('.state-label')
            .data(topojson.feature(data, data.objects.states).features)
            .enter().append("text")
            .attr("class", "state-label")
            .attr("transform", function (d) {
                var loc = path.centroid(d);
                loc[0] -= 30;
                return "translate("+loc+")";
                })
            .attr("dy", ".35em")
            .text((d)=>d.properties['state-name']);
}


d3Chart._drawPoints = function(el, scales, data) {
/*  var g = d3.select(el).selectAll('.d3-points');

 var point = g.selectAll('.d3-point')
    .data(data, function(d) { return d.id; });

  // ENTER
  point.enter().append('circle')
      .attr('class', 'd3-point');

  // ENTER & UPDATE
  point.attr('cx', function(d) { return scales.x(d.x); })
      .attr('cy', function(d) { return scales.y(d.y); })
      .attr('r', function(d) { return scales.z(d.z); });

  // EXIT
  point.exit()
      .remove();
*/
};




module.exports = d3Chart;
