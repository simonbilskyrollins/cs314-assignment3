//http://bl.ocks.org/d3noob/8952219

var delays = ["CarrierDelay", "WeatherDelay", "NASDelay",
"SecurityDelay", "LateAircraftDelay"];

var airports = ['ORD', 'LAX', 'JFK', 'DFW', 'SFO', 'EWR', 'MSP',
'ATL', 'DEN', 'LAS', 'CLT', 'MIA'];

var airlines = ['DLdelay',	'EVdelay',	'OOdelay',	'AAdelay',	'ASdelay',
	'B6delay', 'F9delay',	'HAdelay',	'NKdelay',	'UAdelay',	'VXdelay',	'WNdelay'];

width = 750;
height = 500;

var x = d3.scale.ordinal()
  .rangeRoundBands([0, width]);

var y = d3.scale.linear()
  .rangeRound([height, 0]);

var color = d3.scale.ordinal().range(
  //["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3"] //Set3
  //["#1b9e77", "#d95f02","#7570b3", "#e7298a", "#66a61e"] //Dark2
  ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]
);


var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .tickFormat(d3.format('.2s'))
  .orient("left");

var tooltip = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

var svg = d3.select("body").append("svg")
    .attr("width", width + 200)
    .attr("height", height + 100)
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
        return {x: d.Origin, y: d[c], delay_type: c, total_delay: d.TotalDelay};
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
      .attr("x", function(d) { return x(d.x); })
      // where y0 is the end height of the previous slice of data
      // i.e. where one data chunk ends and the next should begin
      // used to easily determine the height and y-coords of where
      //    the next chunk should begin
      .attr("y", function(d) { return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width", x.rangeBand()-2)
      .on('mouseover', function(d) {
        tooltip.transition()
          .style('opacity', 0.9);
        tooltip.html(pickAirline(d) + ': ' + '<br>' + d.y + ' minutes')
          .style('color', 'black')
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
      .style('fill', 'white')
      .append('text')
        .attr('class', 'title')
        .attr('x', width-100)
        .attr('y', 35)
        .text('Origin Airport');

  svg.append("g")
      .attr("class", "yaxis")
      .call(yAxis)
      .style('fill', 'white')
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
      .attr("transform", function(d, i) { return "translate(130," + (130 - i * 15) + ")"; });

  legend.append('text')
      .attr('x', width - 18)
      .attr('y', 6)
      .attr('dy', '0.5em')
      .style('fill', 'white')
      .text(function(d) {
        switch(d[0].delay_type){
          case 'DLdelay': return 'Delta Airlines';
          case 'EVdelay': return 'ExpressJet Airlines';
          case 'OOdelay': return 'SkyWest Airlines';
          case 'AAdelay': return 'American Airlines';
          case 'ASdelay': return 'Alaska Airlines';
          case 'B6delay': return 'JetBlue Airways';
          case 'F9delay': return 'Frontier Airlines';
          case 'HAdelay': return 'Hawaiian Airlines';
          case 'NKdelay': return 'Spirit Airlines';
          case 'UAdelay': return 'United Airlines';
          case 'VXdelay': return 'Virgin America';
          case 'WNdelay': return 'Southwest Airlines';
        }
      });

  legend.append("rect")
      .attr("x", width - 14)
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", function(d, i) { return color(i); });

  d3.select("select").on("change", change);
  d3.select("#check1").on("change", change2);

  // framework for sorting behavior from here
  // https://bl.ocks.org/mbostock/3885705
  function change() {
    var x0 = x.domain(delay_data.sort(function(a, b){
        if(d3.select('#sortvals').node().value === 'TotalDelay')
        { return b.TotalDelay - a.TotalDelay; }
        else if(d3.select('#sortvals').node().value === 'DL')
        { return b.DLdelay - a.DLdelay; }
        else if(d3.select('#sortvals').node().value === 'EV')
        { return b.EVdelay - a.EVdelay; }
        else if(d3.select('#sortvals').node().value === 'OO')
        { return b.OOdelay - a.OOdelay; }
        else if(d3.select('#sortvals').node().value === 'AA')
        { return b.AAdelay - a.AAdelay; }
        else if(d3.select('#sortvals').node().value === 'AS')
        { return b.ASdelay - a.ASdelay; }
        else if(d3.select('#sortvals').node().value === 'B6')
        { return b.B6delay - a.B6delay; }
        else if(d3.select('#sortvals').node().value === 'F9')
        { return b.F9delay - a.F9delay; }
        else if(d3.select('#sortvals').node().value === 'HA')
        { return b.HAdelay - a.HAdelay; }
        else if(d3.select('#sortvals').node().value === 'NK')
        { return b.NKdelay - a.NKdelay; }
        else if(d3.select('#sortvals').node().value === 'UA')
        { return b.UAdelay - a.UAdelay; }
        else if(d3.select('#sortvals').node().value === 'VX')
        { return b.VXdelay - a.VXdelay; }
        else if(d3.select('#sortvals').node().value === 'WN')
        { return b.WNdelay - a.WNdelay; }
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

    function change2() {
      var layers2;
      var checked;
      if(this.checked){
        layers2 = d3.layout.stack()(airlines.map(function(c) {
          return delay_data.map(function(d) {
              return {x: d.Origin, y: d[c]/d.TotalDelay, delay_type: c, total_delay: d.TotalDelay};
          });
        }));
        checked = true;
      } else {
        layers2 = d3.layout.stack()(airlines.map(function(c) {
          return delay_data.map(function(d) {
              return {x: d.Origin, y: d[c], delay_type: c, total_delay: d.TotalDelay};
          });
        }));
        checked = false;
      }

      x.domain(layers2[0].map(function(d) { return d.x; }));
      y.domain([0, d3.max(layers2[layers2.length - 1], function(d) { return d.y0 + d.y; })]).nice();
      var transition = svg.transition()
    		.duration(250);

      svg.selectAll(".layer").remove();

      var layer2 = svg.selectAll(".layer")
          .data(layers2)
        .enter().append("g")
          .attr("class", "layer")
          .style("fill", function(d, i) { return color(i); });

      var bars = layer2.selectAll("rect")
          .data(function(d) { return d; });


      bars.enter().append("rect")
          .attr('class', 'bar')
          .attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y + d.y0); })
          .attr("width", x.rangeBand()-2)
          .on('mouseover', function(d) {
            tooltip.transition()
              .style('opacity', 0.9);
            if(checked){
              tooltip.html(pickAirline(d) + ': ' + '<br>' + (d.y*100).toFixed(2) + '%')
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 42) + 'px');
            }
            else {
              tooltip.html(pickAirline(d) + ': ' + '<br>' + d.y + ' minutes')
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 42) + 'px');
            }
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

      transition.selectAll('.bar')
        .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); });


      if(this.checked) yAxis.tickFormat(d3.format(".0%"));
      else yAxis.tickFormat(d3.format('.2s'));

    	transition.select(".yaxis")
          .call(yAxis)
        .selectAll("g")

      svg.select('.xaxis').remove();
      svg.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(0," + height + ")")
          .style('fill', 'white')
          .call(xAxis)
          .append('text')
            .attr('class', 'title')
            .attr('x', width-100)
            .attr('y', 35)
            .text('Origin Airport');
    }

    function pickAirline(d){ switch(d.delay_type){
      case 'DLdelay': return 'Delta Airlines';
      case 'EVdelay': return 'ExpressJet Airlines';
      case 'OOdelay': return 'SkyWest Airlines';
      case 'AAdelay': return 'American Airlines';
      case 'ASdelay': return 'Alaska Airlines';
      case 'B6delay': return 'JetBlue Airways';
      case 'F9delay': return 'Frontier Airlines';
      case 'HAdelay': return 'Hawaiian Airlines';
      case 'NKdelay': return 'Spirit Airlines';
      case 'UAdelay': return 'United Airlines';
      case 'VXdelay': return 'Virgin America';
      case 'WNdelay': return 'Southwest Airlines';
    }}
});

function type(d) {
  d.Origin = d.Origin;
  delays.forEach(function(c) { d[c] = +d[c]; });
  airlines.forEach(function(c) { d[c] = +d[c]; });
  return d;
}
