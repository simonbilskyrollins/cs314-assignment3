//http://bl.ocks.org/d3noob/8952219

var delays = ["CarrierDelay", "WeatherDelay", "NASDelay",
"SecurityDelay", "LateAircraftDelay"];

var airports = ['ORD', 'LAX', 'JFK', 'DFW', 'SFO', 'EWR', 'MSP',
'ATL', 'DEN', 'LAS', 'CLT', 'MIA'];

var margin = {top: 20, right: 50, bottom: 30, left: 50},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width]);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var tooltip = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("ontime_by_airport.csv", type, function(data) {

  var delay_data = data.filter(function(data){
    if(airports.includes(data.Origin)) return data.Origin;
  });

  // stack(layers[, index])
  var layers = d3.layout.stack()(delays.map(function(c) {
    return delay_data.map(function(d) {
        return {x: d.Origin, y: d[c], delay_type: c};
    });
  }));

  // domain is made up of each x-element by name
  x.domain(layers[0].map(function(d) { return d.x; }));
  y.domain([0, 275000]).nice();

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x) + 5; })
      .attr("y", function(d) { console.log(d); return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width", x.rangeBand() - 10)
      .on('mouseover', function(d) {
        tooltip.transition()
          .style('opacity', 0.9);
        tooltip.html(d.delay_type + ': ' + '<br>' + d.y)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 42) + 'px');
      })
      .on('mousemove', function(d) {
        tooltip.style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 42) + 'px');
      })
      .on('mouseout', function(d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0);
      });

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .call(yAxis);
});

function type(d) {
  d.Origin = d.Origin;
  delays.forEach(function(c) { d[c] = +d[c]; });
  return d;
}
