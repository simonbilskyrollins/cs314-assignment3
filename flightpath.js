// CS 314 Assignment 3, Spring 2017
// Simon Bilsky-Rollins and Barr Iserloth

var svg = d3.select('body').append('svg')
  .attr('width', 960)
  .attr('height', 600)
  .style('fill', 'none');

var basemap = svg.append('g');
var content = svg.append('g');

var projection = d3.geo.albers();

var path = d3.geo.path()
    .projection(projection);

var scale = d3.scale.linear()
    .domain([-60, -30, 0, 60, 120])
    .range(['#1a9641', '#a6d96a', '#ffffbf', '#fdae61', '#d7191c']);

var tooltip = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

// Draw basemap
var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"
d3.json(url, function(error, us) {
  if (error) throw error;

  // Select just the outer border of the US
  var nation = topojson.mesh(us, us.objects.states, function(a, b) { return a === b; });
  // Select interior state boundaries
  var states = topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; });

  basemap.append('path')
      .datum(nation)
      .attr('class', 'nation')
      .attr('stroke-width', 0.5)
      .attr('d', path);

  basemap.append('path')
      .datum(states)
      .attr('class', 'state')
      .attr('stroke-width', 0.5)
      .attr('d', path);
});

// Load airport data and plot them on the map as points
d3.csv('airports.csv', function(data) {
  content.selectAll('.airport')
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
          .duration(200)
          .style('opacity', 0);
      });
  plotFlightpaths();
});

// Load on-time data and plot flight paths of one airplane
function plotFlightpaths(plane) {
  d3.csv('ontime.csv', function(data) {
    var flightpaths = [];
    if (!plane) {
      plane = randomPlane(data);
    }
    plane = 'N962DL';
    document.getElementById('plane').innerHTML = plane;
    data.filter(function(flight) { return flight.TailNum === plane; })
        .sort(function(a,b) {
          aDate = new Date(a.FlightDate);
          bDate = new Date(b.FlightDate);
          aTime = parseInt(a.DepTime);
          bTime = parseInt(b.DepTime);
          if (aDate.getTime() === bDate.getTime()) {
            return aTime - bTime;
          } else {
            return aDate - bDate;
          }
        })
        .forEach(function(flight) {
          origin = content.select('#' + flight.Origin);
          origin.attr('class', 'airport-visible');
          origin.attr('r', '4px');
          dest = content.select('#' + flight.Dest);
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

    var flightpath = content.selectAll('.flightpath')
        .data(flightpaths);

    flightpath.enter().append('path')
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

    // Animate drawing of each flightpath
    flightpath
        .attr('stroke-dasharray', function() {
          var totalLength = this.getTotalLength();
          return totalLength + ' ' + totalLength;
        })
        .attr('stroke-dashoffset', function() {
          var totalLength = this.getTotalLength();
          return totalLength;
        })
        .transition()
          .duration(250)
          .delay(function(d, i) { return i * 250; })
          .ease('linear')
          .attr('stroke-dashoffset', 0);
    flightpath.exit().remove();
    reorder();
  });
}

// Move circles to front
function reorder() {
  content.selectAll('path, .airport-visible').sort(function(d1, d2) {
    if (d1.path === d2.path) {
      return 0;
    } else if (d1.path === null) {
      return 1;
    } else {
      return -1;
    }
  });
}

function randomPlane(data) {
  i = Math.floor(Math.random() * (data.length + 1));
  plane = data[i].TailNum;
  return plane;
}
