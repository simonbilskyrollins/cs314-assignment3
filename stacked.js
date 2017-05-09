//http://bl.ocks.org/d3noob/8952219

var delays = ["CarrierDelay", "WeatherDelay", "NASDelay",
"SecurityDelay", "LateAircraftDelay"];


var margin = {top: 20, right: 50, bottom: 30, left: 20},
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width]);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var z = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("ontime1.csv", type, function(data) {

  // stack(layers[, index])
  var layers = d3.layout.stack()(delays.map(function(c) {
    return data.map(function(d) {
      return {x: d.Origin, y: d[c]};
    });
  }));

  // domain is made up of each x-element by name
  x.domain(layers[0].map(function(d) { return d.x; }));

  // domain gets max y-value by summing all the stacked data elements
  // thus, domain goes from 0 to this maximum value
  // nice() function is to make the tick marks behave
  y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return z(i); });

  layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width", x.rangeBand() - 1);

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
