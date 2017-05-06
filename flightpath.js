// CS 314 Assignment 3, Spring 2017
// Simon Bilsky-Rollins and Barr Iserloth

var svg = d3.select('body').append('svg')
  .attr('width', 960)
  .attr('height', 600)
  .style('fill', 'none')
  .attr('stroke', 'black');

var path = d3.geo.path();

var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"
d3.json(url, function(error, us) {
  if (error) throw error;

  var states = topojson.feature(us, us.objects.states);

  svg.selectAll('.state')
      .data(states.features)
    .enter().append("path")
      .attr("stroke-width", 0.5)
      .attr("d", path);
});
