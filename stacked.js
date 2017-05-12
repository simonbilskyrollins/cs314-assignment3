//http://bl.ocks.org/d3noob/8952219

var delays = ["CarrierDelay", "WeatherDelay", "NASDelay",
"SecurityDelay", "LateAircraftDelay"];

var airports = ['ORD', 'LAX', 'JFK', 'DFW', 'SFO', 'EWR', 'MSP',
'ATL', 'DEN', 'LAS', 'CLT', 'MIA'];

var airlines = ['DLdelay',	'EVdelay',	'OOdelay',	'AAdelay',	'ASdelay',
	'B6delay', 'F9delay',	'HAdelay',	'NKdelay',	'UAdelay',	'VXdelay',	'WNdelay'];

width = 1000;
height = 500;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width]);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.ordinal().range(
  //["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"] //Set3
  //["#1b9e77", "#d95f02","#7570b3", "#e7298a", "#66a61e"] //Dark2
  ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c',
'#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928']
);


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

d3.csv("total_aggregation.csv", type, function(data) {

  //data.sort(function(a, b) { return b.TotalDelay - a.TotalDelay; });
  // filter to only relevant, large airports
  var delay_data = data.filter(function(data){
    if(airports.includes(data.Origin)) return data.Origin;
  });

  // map each delay type to a specific origin airport
  // also include the name of the delay type itself
  var layers = d3.layout.stack()(airlines.map(function(c) {
    return delay_data.map(function(d) {
        return {x: d.Origin, y: d[c], delay_type: c};
    });
  }));

  // domain is made up of each x-element by name
  x.domain(layers[0].map(function(d) { return d.x; }));
  // domain is made up of max y-value from all the layers summed together
  y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); })

  layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr('class', 'bar')
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
        tooltip.html(d.delay_type + ': ' + '<br>' + d.y + ' minutes')
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
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append('text')
        .attr('class', 'title')
        .attr('x', width-100)
        .attr('y', 35)
        .text('Origin Airport');

  svg.append("g")
      .attr("class", "yaxis")
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
      .attr("transform", function(d, i) { return "translate(0," + (50 - i * 8) + ")"; });

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
      .attr("x", width - 8)
      .attr("width", 8)
      .attr("height", 8)
      .attr("fill", function(d, i) { return color(i); });

  d3.select("select").on("change", change);

  // framework for sorting behavior from here
  // https://bl.ocks.org/mbostock/3885705
  function change() {
    var x0 = x.domain(delay_data.sort(function(a, b){
        if(d3.select('#sortvals').node().value === 'TotalDelay'){ return b.TotalDelay - a.TotalDelay; }
        else if(d3.select('#sortvals').node().value === 'LateAircraftDelay'){ return b.LateAircraftDelay - a.LateAircraftDelay; }
        else if(d3.select('#sortvals').node().value === 'SecurityDelay'){ return b.SecurityDelay - a.SecurityDelay; }
        else if(d3.select('#sortvals').node().value === 'NASDelay'){ return b.NASDelay - a.NASDelay; }
        else if(d3.select('#sortvals').node().value === 'WeatherDelay'){ return b.WeatherDelay - a.WeatherDelay; }
        else if(d3.select('#sortvals').node().value === 'CarrierDelay'){ return b.CarrierDelay - a.CarrierDelay; }
        else{ return d3.ascending(a.Origin, b.Origin); }
      }).map(function(d) { return d.Origin; }))
        .copy();

        var transition = svg.transition().duration(1000);

        transition.selectAll(".bar")
            .attr("x", function(d) { return x0(d.x); });

        transition.select(".xaxis")
            .call(xAxis)
          .selectAll("g")
    }
});

function type(d) {
  d.Origin = d.Origin;
  delays.forEach(function(c) { d[c] = +d[c]; });
  airlines.forEach(function(c) { d[c] = +d[c]; });
  return d;
}
