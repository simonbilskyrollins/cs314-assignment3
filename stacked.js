//http://bl.ocks.org/d3noob/8952219

var delays = ["CarrierDelay", "WeatherDelay", "NASDelay",
"SecurityDelay", "LateAircraftDelay"];

var airports = ['ORD', 'LAX', 'JFK', 'DFW', 'SFO', 'EWR', 'MSP',
'ATL', 'DEN', 'LAS', 'CLT', 'MIA'];

width = 1000;
height = 500;

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
    .attr("width", width + 150)
    .attr("height", height + 150)
  .append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");

d3.csv("ontime_by_airport.csv", type, function(data) {

  // filter to only relevant, large airports
  var delay_data = data.filter(function(data){
    if(airports.includes(data.Origin)) return data.Origin;
  });

  // map each delay type to a specific origin airport
  // also include the name of the delay type itself
  var layers = d3.layout.stack()(delays.map(function(c) {
    return delay_data.map(function(d) {
        return {x: d.Origin, y: d[c], delay_type: c};
    });
  }));

  // domain is made up of each x-element by name
  x.domain(layers[0].map(function(d) { return d.x; }));
  y.domain([0, 280000]).nice();

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x) + 5; })
      // where y0 is the end height of the previous slice of data
      // i.e. where one data chunk ends and the next should begin
      // used to easily determine the height and y-coords of where
      //    the next chunk should begin
      .attr("y", function(d) { return y(d.y + d.y0); })
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
      .call(xAxis)
      .append('text')
        .attr('class', 'title')
        .attr('x', width-100)
        .attr('y', 35)
        .text('Origin Airport');

  svg.append("g")
      .attr("class", "axis")
      .call(yAxis)
      .append('text')
        .attr('class', 'title')
        .attr('x', -45)
        .attr('y', -15)
        .text('Delay (Minutes)');

  var legend = svg.append("g")
      .attr('class', 'legend')
      .attr('text-anchor', 'end')
    .selectAll("g")
    .data(layers)
    //placing legend rect locations: height/width of 15, so shift
    //  down by 15px for each element of the legend
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });

  legend.append('text')
      .attr('x', width - 18)
      .attr('y', 6)
      .attr('dy', '0.5em')
      .text(function(d) {
        switch(d[0].delay_type){
          case 'CarrierDelay': return 'Carrier Delay';
          case 'WeatherDelay': return 'Weather Delay';
          case 'NASDelay': return 'NAS Delay';
          case 'SecurityDelay': return 'Security Delay';
          case 'LateAircraftDelay': return 'Late Aircraft Delay';
        }
      });

  legend.append("rect")
      .attr("x", width - 14)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", function(d, i) { return color(i); });

});

function type(d) {
  d.Origin = d.Origin;
  delays.forEach(function(c) { d[c] = +d[c]; });
  return d;
}
