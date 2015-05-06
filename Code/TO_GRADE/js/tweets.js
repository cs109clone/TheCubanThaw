var width = 960,
    height = 580;

var color = d3.scale.category10();

var projection = d3.geo.kavrayskiy7()
    .scale(170)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#tweetMap").append("svg")
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

/*
 * Show a single tweet at the given latitude and longitude.
 * The r (radius) variable indicates how large to make the
 * resulting tweet circle (given in raw SVG points).
 */

function show_tweet(lat, lng, r, is_rt) {

    projxy = projection([lng, lat]);

      svg.append("circle")
          .attr("cx", projxy[0])
          .attr("cy", projxy[1])
          .attr("r", 0)
          .attr("class", "tweet" + (is_rt ? " retweet" : ""))
          .transition()
          .ease(Math.sqrt)
          .duration(1000)
          .attr("r", r)
        .transition()
          .duration(1000)
          .ease(Math.sqrt)
          .attr("r", r * 1.5)
          .style("fill-opacity", 1e-6)
          .style("stroke-opacity", 1e-6)
          .remove()
          ;
}

//setTimeout(function(){ show_tweet(25.775278, -80.208889, 5);  }, 1000);  // miami
//setTimeout(function(){ show_tweet(40.7127, -74.0059, 5);  }, 1500);      // new york city
//setTimeout(function(){ show_tweet(25.775278, -80.208889, 3);  }, 1700);  // miami
//setTimeout(function(){ show_tweet(19.433333, -99.133333, 7); }, 2000);   // mexico city

/*
 * Function to animate data rows. Is real animation, but the time delay
 * since the previous tweet is not real. That part is randomly simulated.
 */

function faux_animate(rows) {
    var radius_scale = d3.scale.log().base(3);

    var curdelay = 0;
    rows.forEach(function(row,i) {
        var radius = radius_scale(row.followers_count);
        curdelay += Math.random() * 250;
        setTimeout(function(){ show_tweet(row.lat, row.lng, radius, row.is_retweet);  }, curdelay);
    });
}

function msec_animate(rows) {
    var radius_scale = d3.scale.log().base(3);

    var curdelay = 0;
    rows.forEach(function(row,i) {
        var radius = radius_scale(row.followers_count);
        curdelay += row.msec;
        setTimeout(function(){ show_tweet(row.lat, row.lng, radius, row.is_retweet);  }, curdelay);
    });
}

var byseconds;
var radius_scale = d3.scale.log().base(3),
    cur_nsec = 0,
    factor = 20;

function nsec_animate(sec_index) {
    events = byseconds[sec_index];
    cur_nsec = events[0].nsec;
    events.forEach(function(e,i) {
        var radius = radius_scale(e.nfollow);
        show_tweet(e.lat, e.lng, radius, e.is_rt);
    });
    var next_index = sec_index + 1;
    if (next_index < byseconds.length) {
        console.log("delay calc", byseconds[next_index][0].nsec, cur_nsec);
        var delay = (byseconds[next_index][0].nsec - cur_nsec) / factor;
        console.log("delay", delay);
        setTimeout(function(){ nsec_animate(sec_index+1); }, delay);
    }
}

d3.csv("data/coresamp.csv")
    .row(function(d) {
        // Must convert some CSV data to more appropriate types
        // console.log("rawrow", JSON.stringify(d));
        return {
            lat: parseFloat(d.lat),
            lng: parseFloat(d.lng),
            is_rt: parseInt(d.is_rt),
            nfollow: parseInt(d.nfollow),
            nsec: parseInt(d.nsec)
        };
    })
    .get(function(error, rows) {
        console.log("final rows", rows);
        byseconds = [ [] ];
        var thismsec = 0;
        console.log("byseconds", byseconds);
        rows.forEach(function(r,i) {
            if (r.nsec == thismsec) {
                var lastrec = byseconds.length-1;
                console.log("lastrec", lastrec);
                byseconds[lastrec].push(r);
            }
            else {
                thismsec = r.nsec;
                byseconds.push([ r ]);
            }
        });
        console.log("byseconds final", JSON.stringify(byseconds));
        nsec_animate(0);
    });