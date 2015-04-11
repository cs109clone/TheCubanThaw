
MapVis = function (_parentElement, _data, _tweets, _eventHandler) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.tweets = _tweets;

    //console.log(this.tweets);
    this.eventHandler = _eventHandler;
    this.displayData = [];

    

    this.margin = { top: 20, right: 20, bottom: 30, left: 0 },
    this.width = 1000 - this.margin.left - this.margin.right + 200;
    this.height = 900 - this.margin.top - this.margin.bottom;

    this.initVis();
}


MapVis.prototype.initVis = function () {

    this.democratColor = d3.scale.linear()
        .domain([50, 100])
        .range(["#abbdcf", "#0d1b28"]);

    this.republicanColor = d3.scale.linear()
        .domain([50, 100])
        .range(["#ff7f7f", "#660000"]);
        //.interpolate(d3.interpolateLab);

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.projection = d3.geo.albersUsa()
    .scale(1500)
    .translate([this.width / 2, this.height / 2]);

    this.path = d3.geo.path().projection(this.projection);




    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}




MapVis.prototype.wrangleData = function () {

    this.displayData = this.data;
    
  
    this.displayData.states = topojson.feature(this.data, this.data.objects.states).features;
    this.tweets.location = topojson.feature(this.tweets, this.tweets.objects.tweets).features;

    console.log(this.displayData.states);
    console.log(this.tweets.location);

    //this.displayData.counties = topojson.feature(this.data, this.data.objects.counties).features;

}


MapVis.prototype.updateVis = function () {

    var that = this;


    /*var quakeColor = d3.scale.linear()
        .domain([5, 60])
        .range(["#275b82", "#f9fbfd"])
        .interpolate(d3.interpolateLab);*/

   // var counties = this.svg.selectAll('path')
   //             .data(this.displayData.states)
   //             .enter().append("path")
   //             .attr("d", this.path)


    var states = this.svg.selectAll('path')
                .data(this.displayData.states)
                .enter().append("path")
                .attr("d", this.path)
                .attr('fill', function (d) {
                    if (d.properties.obama_rate > d.properties.romney_rate)
                        return that.democratColor(d.properties.obama_rate);
                    else
                        return that.republicanColor(d.properties.romney_rate);
                })
                .attr('class', 'states');

    var min = 1418828898;
   
    this.tweeting(min)
    

   /* var bird = this.svg.selectAll("path")
                   .data(this.tweets.location)
                   .enter();

    var fly = bird.append('path')
               .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
               .attr('fill', '#3BA9EE')
               .attr('d', "M 630, 425 " + 
                          " A 195, 195 0 0 1 331, 600 " + 
                          "A 142, 142 0 0 0 428, 570 " + 
                          "A  70,  70 0 0 1 370, 523 " + 
                          "A  70,  70 0 0 0 401, 521 " +
                          "A  70,  70 0 0 1 344, 455 " +
                          "A  70,  70 0 0 0 372, 460 " +
                          "A  70,  70 0 0 1 354, 370 " +
                          "A 195, 195 0 0 0 495, 442 " +
                          "A  67,  67 0 0 1 611, 380 " +
                          "A 117, 117 0 0 0 654, 363 " +
                          "A  65,  65 0 0 1 623, 401 " +
                          "A 117, 117 0 0 0 662, 390 " +
                          "A  65,  65 0 0 1 630, 425 Z");*/


    /*var rings = explosion.append('circle')
                .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
                .attr("class", "ring")
                .attr("r", 2)
                .style("stroke-width", .5)
                .attr('fill', 'none')
                .style("stroke", function (d, i) { return quakeColor(10); })
                .transition()
                .ease("linear")
                .duration(2500)
                .style("stroke-opacity", 0.00001)
                .style("stroke-width", 2)
                .attr("r", Math.pow(2, 5))
                .remove();


    /*var coordinates = this.svg.selectAll("circle")
                        .data(this.displayData.coordinates)
                        .enter().append("circle")
                        .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
                        .attr('fill', function () { return quakeColor(30); })
                        .attr("stroke-width", 3)
                        .attr('r', 4)
                        .style('fill', '#275b82')
                        .transition()
				        .duration(2500)
				        .attr("r", Math.pow(1.7, 2))
				        .style("opacity", .1)
				        .remove();*/
    /*
    var rings = this.svg.selectAll("circle")
                .data(this.displayData.coordinates)
                .enter().append("circle")
                 .attr("transform", function (d) { return "translate(" + that.path.centroid(d) + ")"; })
                .attr("class", "ring")
                .attr("r", 2)
                .style("stroke-width", .5)
                .style("stroke", function () { return quakeColor(30);})
        .transition()
          .ease("linear")
          .duration(1500)
          .style("stroke-opacity", 0.00001)
          .style("stroke-width", 1)
          .attr("r", Math.pow(2, 4))
          .remove();
    // .each(this.explode);*/

    /*circle = quake.append("circle")
				.attr("class", "quake-circle")
				.attr("r", 4)
				.style("fill", function (d) {
				    return quakeColor(sortedData[position].geometry.coordinates[2])
				})
				.transition()
				 .duration(2500)
				  .attr("r", Math.pow(1.7, sortedData[position].properties.mag))
				  .style("opacity", .1)
				  .remove();

    rings = quake.append("circle")
        .attr("class", "ring")
        .attr("r", 2)
        .style("stroke-width", .5)
        .style("stroke", function (d) {
            return quakeColor(sortedData[position].geometry.coordinates[2])
        })
        .transition()
          .ease("linear")
          .duration(1500)
          .style("stroke-opacity", 0.00001)
          .style("stroke-width", 1)
          .attr("r", Math.pow(2, sortedData[position].properties.mag))
          .remove();*/
}


MapVis.prototype.tweeting = function (time) {

    var that = this;
 

    var tweets = this.svg.selectAll("circle")
                  .data(this.tweets.location)
                  .enter();

    var fly;
    setInterval(function () {
        fly = tweets.append('circle')
                 .attr("transform", function (d) {
                     if (d.properties.time == time) {
                       
                         return "translate(" + that.path.centroid(d) + ")";
                     }})
                 .attr('fill', 'green')
                 .attr("stroke-width", 3)
                 .attr('r', 40)
                 .transition()
                 .duration(2000)
                 .attr("r", Math.pow(1.5, 5))
                 .attr("stroke-width", 50)
                 .style("opacity", .01)
                 .remove();
        time += 1;
    }, 10);
}


MapVis.prototype.onSelectionChange = function (selectionStart, selectionEnd) {

}

MapVis.prototype.onHover = function () {

}



