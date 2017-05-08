// CS 314 Assignment 3, Spring 2017
// Simon Bilsky-Rollins and Barr Iserloth

var svg = d3.select('body').append('svg')
  .attr('width', 960)
  .attr('height', 600)
  .style('fill', 'none');

var projection = d3.geo.albers();

var path = d3.geo.path()
    .projection(projection);

var scale = d3.scale.linear()
    .domain([-60, -30, 0, 60, 120])
    .range(['#1a9641', '#a6d96a', '#ffffbf', '#fdae61', '#d7191c']);

var tooltip = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"
d3.json(url, function(error, us) {
  if (error) throw error;

  var nation = topojson.mesh(us, us.objects.states, function(a, b) { return a === b; });
  var states = topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; });

  svg.append('path')
      .datum(nation)
      .attr('class', 'nation')
      .attr('stroke-width', 0.5)
      .attr('d', path);

  svg.append('path')
      .datum(states)
      .attr('class', 'state')
      .attr('stroke-width', 0.5)
      .attr('d', path);
});

d3.csv('airports.csv', function(data) {
  svg.selectAll('.airport')
      .data(data)
    .enter().append('circle')
      .attr('class', 'airport')
      .attr('id', function(d) { return d.code; })
      .attr('long', function(d) { return d.longitude; })
      .attr('lat', function(d) { return d.latitude; })
      .attr('cx', function(d) { return projection([d.longitude, d.latitude])[0]; })
      .attr('cy', function(d) { return projection([d.longitude, d.latitude])[1]; })
      .attr('r', '2px')
      .on('mouseover', function(d) {
        tooltip.transition()
          .style('opacity', 0.9);
        tooltip.html('<b>' + d.code + '</b><br/>' + d.city + ', ' + d.state)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 42) + 'px');
      })
      .on('mousemove', function(d) {
        tooltip.style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 42) + 'px');
      })
      .on('mouseout', function(d) {
        tooltip.transition()
          .duration(2000)
          .style('opacity', 0);
      })
    .append('title')
      .text(function(d) { return d['code'] + ' - ' + d['name']; });

  d3.csv('ontime.csv', function(data) {
    flightpaths = [];
    plane = 'N836DN';
    data.filter(function(flight) { return flight.TailNum === plane; })
        .forEach(function(flight) {
          origin = svg.select('#' + flight.Origin);
          origin.attr('class', 'airport-visible');
          origin.attr('r', '4px');
          dest = svg.select('#' + flight.Dest);
          dest.attr('class', 'airport-visible');
          dest.attr('r', '4px');
          flightpaths.push({
            carrier: flight.Carrier,
            number: flight.FlightNum,
            origin: flight.Origin,
            dest: flight.Dest,
            delay: flight.ArrDelay,
            path: {
              type: 'LineString',
              coordinates: [
                [ origin.attr('long'), origin.attr('lat') ],
                [ dest.attr('long'), dest.attr('lat') ]
              ]
            }
          });
    });
    svg.selectAll('.flightpath')
        .data(flightpaths)
      .enter().append('path')
        .attr('class', 'flightpath')
        .attr('stroke-width', 2)
        .style('stroke', function(d) { return scale(d.delay); })
        .attr('d', function(d) { return path(d.path); })
        .on('mouseover', function(d) {
          tooltip.transition()
            .style('opacity', 0.9);
          tooltip.html('<b>' + d.carrier + ' ' + d.number + '</b><br/>' + d.origin + ' - ' + d.dest + '<br/> Delay: ' + d.delay)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 42) + 'px');
        })
        .on('mousemove', function(d) {
          tooltip.style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 42) + 'px');
        })
        .on('mouseout', function(d) {
          tooltip.transition()
            .duration(2000)
            .style('opacity', 0);
        });
    reorder();
  });
});

// Move circles to front
function reorder () {
  svg.selectAll('path, circle').sort(function(d1, d2) {
    if (d1.type === d2.type) {
      return 0;
    } else if (d1.type === 'circle') {
      return 1;
    } else {
      return -1;
    }
  });
}
