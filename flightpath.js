// CS 314 Assignment 3, Spring 2017
// Simon Bilsky-Rollins and Barr Iserloth

var svg = d3.select('body').append('svg')
  .attr('width', 960)
  .attr('height', 600)
  .style('fill', 'none')
  .attr('stroke', 'black');

var projection = d3.geo.albers();

var path = d3.geo.path()
    .projection(projection);

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
      .attr('r', '1px')
    .append('title')
      .text(function(d) { return d['code'] + ' - ' + d['name']; });
});

d3.csv('ontime.csv', function(data) {
  flightpaths = [];
  plane = 'N917DE';
  data.filter(function(flight) { return flight.TailNum === plane; })
      .forEach(function(flight) {
        origin = svg.select('#' + flight.Origin);
        dest = svg.select('#' + flight.Dest);
        flightpaths.push({
          type: 'LineString',
          coordinates: [
            [origin.attr('long'), origin.attr('lat')],
            [dest.attr('long'), dest.attr('lat')]
          ]
        });
  });
  svg.selectAll('.flightpath')
      .data(flightpaths)
    .enter().append('path')
      .attr('class', 'flightpath')
      .attr('stroke-width', 0.5)
      .attr('d', path);
});
