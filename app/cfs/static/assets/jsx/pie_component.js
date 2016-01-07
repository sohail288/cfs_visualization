// pie_component.js

var pieChart = {};

pieChart.create = function(el, props, state) {

    var margin = props.margins;

    var width = props.width - margin.right - margin.left,
        height = props.height - margin.top - margin.bottom;

    

    var svg = d3.select(el).append('svg')
                .attr('width', props.width)
                .attr('height', props.height)
                .attr('id', props.title)
                .attr('class', 'pie')
                  .append("g")
                    .attr("transform", "translate("+margin.left+"," +margin.top+")");

    this._drawPie(el, props, state);
    this.update(el, props, state);
};


pieChart._drawPie = function(el, props, state) {

    var margin = props.margins;

    var width = props.width - margin.right - margin.left,
        height = props.height - margin.top - margin.bottom;
    // append the group
    d3.select(el).select("svg").select("g")
      .append("g")
        .attr("transform", "translate(" + width/2+","+height/2+")");
}

pieChart.update = function(el, props, state) {
    var margin = props.margins;

    var width = props.width - margin.right - margin.left,
        height = props.height - margin.top - margin.bottom;

    // try top 10 breakdown values 

    var svg = d3.select(el).select("svg").select("g").select("g");

    svg.selectAll(".arc").remove();

    var radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);

    var labelArc = d3.svg.arc()
                    .outerRadius(radius - 30)
                    .innerRadius(radius - 30);

    var pieChart = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {return d.counts;});


    // get top 10
    var data = state.data.sort(function(a,b) {
        return b.counts - a.counts;
    }).slice(0, 10);

    var color = d3.scale.category10().domain(data.map((d)=> d.code));

    var g = svg.selectAll(".arc")
                .data(pieChart(data));

    var update_elems = g.attr("id", (d)=>d.data.Description)
                        .transition()
                        .duration(1000)
                        .ease("linear")
                        .attr("d", arc)
                        .style("fill", (d)=>color(d.data.code));

    var enter = g.enter()
                  .append("g")
               .attr("class", "arc")
               .attr("id", (d)=>d.data.Description);

    enter.append("path")
     .attr("d", arc)
        // the pie function placed the data into the data member
     .style("fill", (d)=>color(d.data.code))
     .style("stroke", "white");

    enter.append("text")
        .attr("transform", (d)=>"translate("+labelArc.centroid(d)+")")
        .attr("dy", ".8px")
        .attr("class", "pie-label")
        .text((d)=>d.data.Description);
}


pieChart._addToolTips = function() {

}

pieChart.clear = function(el) {
    d3.select(el).select("svg").select("g").select("g").selectAll(".arc").remove();
}

pieChart.destroy= function(el) {

    //console.log("unmounting");
}
        

module.exports = pieChart;
