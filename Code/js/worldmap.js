


var width, height, color, projection, path, graticule, svg;


function display_world_map() {
  width = 800;
  height = 480;

  color = d3.scale.category10();

  projection = d3.geo.kavrayskiy7()
      .scale(140)
      .translate([width / 2, height / 2])
      .precision(.1);

  path = d3.geo.path()
      .projection(projection);

  graticule = d3.geo.graticule();

  d3.select("#tweetMap svg").remove();
  svg = d3.select("#tweetMap").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

  svg.append("use")
      .attr("class", "stroke")
      .attr("xlink:href", "#sphere");

  svg.append("use")
      .attr("class", "fill")
      .attr("xlink:href", "#sphere");


  d3.json("data/world-110m.json", function(error, world) {
    var countries = topojson.feature(world, world.objects.countries).features,
        neighbors = topojson.neighbors(world.objects.countries.geometries);

      svg.append("path")
          .datum(graticule)
          .attr("class", "graticule")
          .attr("d", path);

    svg.selectAll(".country")
        .data(countries)
      .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path);
        // .style("fill", function(d, i) { return "skyblue" });
        // .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });

  d3.select(self.frameElement).style("height", height + "px");
}


function display_us_map() {

  width = 960;
  height = 500;

  projection =
    d3.geo.conicConformal()
      .rotate([98, 0])
      .center([0, 38])
      .parallels([29.5, 45.5])
      .scale(1000)
      .translate([width / 2, height / 2])
      .precision(.1);

  path = d3.geo.path()
      .projection(projection);

  graticule = d3.geo.graticule()
      .extent([[-98 - 45, 38 - 45], [-98 + 45, 38 + 45]])
      .step([5, 5]);

  d3.select("#tweetMap svg").remove();
  svg = d3.select("#tweetMap").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  d3.json("data/us.json", function(error, us) {
    svg.insert("path", ".graticule")
        .datum(topojson.feature(us, us.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "state-boundary")
        .attr("d", path);
  });

  d3.select(self.frameElement).style("height", height + "px");
}