
hist_component = {};

hist_component.create = function(el, props, state) {
    var margin = props.margins;
    var svg = d3.select(el).append('svg')
                .attr("width", props.width)
                .attr("height", props.height)
            .append("g")
                .attr("transform", "translate("+margin.left+","+margin.top+")")
                .attr("class", props.title+"-area");

    this._drawHistogram(el, state);
}

hist_component._drawHistogram = function(el,state) {

    console.log("...");

}

hist_component.update = function(el, props, state) {

    var svg = d3.select(el).select("svg g");

    var tickformat = d3.format("^.1e");
    
    var x = d3.scale.linear()
              .domain(d3.extent(state.data))
              .range([0, state.width]);
    
    var data = d3.layout.histogram()
                .bins(x.ticks(10))(state.data);

    var y = d3.scale.linear()
              .domain([0, d3.max(data, (d)=>d.y)])
              .range([state.height, 0]);

    var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(10);
    xAxis.tickFormat(tickformat);

    var barBound = svg.selectAll(".bar")
                .data(data);

    // update
    barBound.transition().duration(500)
        .attr("transform", (d) => "translate("+x(d.x)+","+y(d.y)+")");

    barBound.select("rect")
            .attr("height", function(d) {
                var curHeight = parseInt($(this).attr('height'));
                console.log("current height", curHeight);
                return isNaN(curHeight) ? 0: curHeight;
            })
            .transition()
        .duration(500)
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", (d) => state.height- y(d.y));

    barBound.select("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", x(data[0].dx)/2)
            .attr("text-anchor", "middle")
            .text((d)=>d.y);

    //append
    var barEnter = barBound.enter().append("g")
                .attr("class", "bar")
                .attr("transform", (d) => "translate("+x(d.x)+","+state.height+")");
    barEnter.append("rect")
                .transition()
            .duration(250)
                .attr("transform", (d) => "translate("+x(d.x)+","+y(d.y)+")")
            .attr("x", 1)
            .attr("width", x(data[0].dx) -1)
            .attr("height", (d) => state.width - y(d.y));

    barEnter.append("text")
            .attr("dy", ".75em")
            .attr("y", 10)
            .attr("x", x(data[0].dx)/2)
            .attr("text-anchor", "middle")
            .text((d)=>d.y);

    // remove the ones that should be gone.
    barBound.exit().selectAll(".rect").attr("height", 0);
    barBound.exit().transition().duration(250).remove();

    // see if the axis exists already don't add the axis
    if (svg.select(".x")[0][0] === null) {
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0,"+state.height+")")
            .call(xAxis);
    } else {
        svg.select(".x").attr("transform", "translate(0,"+state.height+")")
            .call(xAxis); 
    }

}

hist_component.clear = function(el) {
    d3.select(el).selectAll(".bar").remove();

}

module.exports = hist_component;
