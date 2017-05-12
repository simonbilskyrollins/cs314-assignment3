# CS 314 Assignment 3

Barr Iserloth and Simon Bilsky-Rollins

## Viewing

To run either of our two visualizations, first boot up a simple server: `python3 -m http.server`

Then navigate to either [http://localhost:8000/stacked.html](http://localhost:8000/stacked.html) or [http://localhost:8000/flightpath.html](http://localhost:8000/flightpath.html).

## Table of Contents

`aggregation.R`: R script used to manipulate the original dataset, aggregating delay statistics by airport and airline.

`airports.csv`: USGS dataset of domestic US airports containing airport codes, airport cities, and lat/long coordinates.

`flightpath.html`: HTML for our flight paths visualization.

`flightpath.js`: Flight paths visualization.

`flights.csv`: Original on-time performance dataset, trimmed down to just a few columns needed for the flight paths visualization.

`stacked.html`: HTML for our stacked bar chart visualization.

`stacked.js`: Stacked bar chart visualization.

`total_aggregation.csv`: Manipulated on-time performance dataset containing aggregated delay statistics for each airport and airline.

`us.json`: TopoJSON file containing US national and state borders, used to draw basemap in the flight paths visualization.

