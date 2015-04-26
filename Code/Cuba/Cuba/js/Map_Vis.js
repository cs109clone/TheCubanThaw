
MapVis = function (_parentElement, _data, _tweets, _eventHandler) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.tweets = _tweets;

    this.eventHandler = _eventHandler;
    this.displayData = [];




    this.dateFormat = d3.time.format("%B %d %H:%M %p");
    this.margin = { top: 0, right: 100, bottom: 10, left: 0 },
    this.width = getInnerWidth(this.parentElement),
    this.height = 500 - this.margin.top - this.margin.bottom;
    //Hours in seconds
    this.hour = 3600;

    this.initVis();
}


MapVis.prototype.initVis = function () {


    //console.log(this.tweets.objects.tweets.geometries[0].properties.time);

    this.minTime = d3.min(this.tweets.objects.tweets.geometries, function (d) {
        return d.properties.time;
    });

    this.maxTime = d3.max(this.tweets.objects.tweets.geometries, function (d) {
        return d.properties.time;
    });


    this.fly;

    var that = this;
    this.anime;
    this.tweeting;
    this.states;

    this.totalHours = (this.maxTime - this.minTime) / this.hour;

    this.democratColor = d3.scale.linear()
        .domain([50, 100])
        .range(["#0000ff", "#0000b3"]);

    this.republicanColor = d3.scale.linear()
        .domain([50, 100])
        .range(["#FF0000", "#b30000"]);
    //.interpolate(d3.interpolateLab);

    this.playStopButton = d3.select('#play')
                  .on("click", function () {
                      $(that.eventHandler).trigger("runSlide", this);
                  });

    this.range = d3.select('#slider')
                   .attr('max', Math.round(this.totalHours) - 1)
                   .attr('min', -1)
                   .attr('step', 1)
                   .attr('value', -1);

    this.presView = d3.select('#pres-view')
                      .on('click', function(){
                          $(that.eventHandler).trigger("chooseView", this);
                      });

    this.sentView = d3.select('#sent-view')
                      .on('click', function () {
                          $(that.eventHandler).trigger("chooseView", this);
                      });



    /* 
 
     this.time = this.block.append('span')
                     .attr('class', 'time')
                     .text(this.dateFormat(new Date(this.minTime * 1000)))*/

    this.svg = this.parentElement.append("svg")
         .attr('class', 'map-vis')
        .attr("width", this.width)
        .attr("height", this.height)

        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");




    this.projection = d3.geo.albersUsa()
    .scale(800)
    .translate([this.width / 2, this.height / 2]);

    this.path = d3.geo.path().projection(this.projection);


    //this.options = this.parentElement.append('div')
    //             .attr('class', 'choice')

    //this.presidential = this.options
    //            .append('button')
    //            .on('click', function () {
    //                that.presidentialData();
    //            })
    //            .attr('class', 'button-choice')
    //            .text('Presidential')


    //this.sentimental = this.options
    //            .append('button')
    //            .on('click', function () {
    //                that.sentimentalData();
    //            })
    //            .attr('class', 'button-choice')
    //            .text('Sentimental')




    this.timeBucket = [];
    this.aggregate();


    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}




MapVis.prototype.wrangleData = function () {

    this.displayData = this.data;

    this.displayData.states = topojson.feature(this.displayData, this.displayData.objects.states).features;
    //this.tweets.location = topojson.feature(this.tweets, this.tweets.objects.tweets).features;



    //this.displayData.counties = topojson.feature(this.data, this.data.objects.counties).features;

}


MapVis.prototype.updateVis = function () {

    var that = this;

    this.states = this.svg.selectAll('path')
                .data(this.displayData.states)
                .enter().append("path")
                .attr("d", this.path)
                .attr('class', 'states')
               /* .on("click", function (d) {
                    $(that.eventHandler).trigger("selectionChanged", d.properties.code);
                });*/
                
    this.presidentialData();
}


MapVis.prototype.animate = function (type) {

    var that = this;
    var current;
    var element = document.getElementById('slider');

    if (type === 'Play') {
        this.playStopButton.attr('class', 'stop-button').text('Stop');
        this.tweeting = setInterval(function () {
            current = parseInt(element.value) + 1;
            that.poping(current);
            element.value = parseInt(element.value) + 1;
            if (current === Math.round(that.totalHours) + 1)
                clearInterval(that.tweeting);

        }, 2000);
    }
    else {
        this.playStopButton.attr('class', 'play-button').text('Play');
        clearInterval(this.tweeting)
    }
}

MapVis.prototype.animate2 = function (element) {


    var that = this;
    var current;



//    this.playStopButton.attr('class', 'stop-button').text('Stop');

    current = element + 1;
    that.poping(element + 1);





 //   this.playStopButton.attr('class', 'play-button').text('Play');


}

MapVis.prototype.popTweets = function (time) {

    if (time == undefined)
        time = document.getElementById('slider-val').value;
    var that = this;

    var fly = this.tweeting.append('circle')
             .attr("transform", function (d) {

                 if (d.properties.time >= time && d.properties.time < time + 3600) {
                     return "translate(" + that.path.centroid(d) + ")";
                 }
             })

             .attr('fill', '#ffff00')
             .attr("stroke-width", 3)
             .attr('r', 2)
             .transition()
             .duration(2000)
             .attr("r", Math.pow(1.4, 6))
             .attr("stroke-width", 50)
             .style("opacity", .01)
             .ease('linear')
             .remove();

    this.time.text(this.dateFormat(new Date(time * 1000)));
}


MapVis.prototype.sentimentalData = function () {
    var that = this;
    
    this.states 
                .attr('fill', 'black')
                .on("click", function (d) {
                    $(that.eventHandler).trigger("selectionChanged", d.properties.code);
                });
}

MapVis.prototype.presidentialData = function () {
    var that = this;

    this.states
        .attr('fill', function (d) {
            if (d.properties.obama_rate > d.properties.romney_rate)
                return that.democratColor(d.properties.obama_rate);
            else
                return that.republicanColor(d.properties.romney_rate);
        })
        .on("click", null);

                
}

MapVis.prototype.aggregate = function () {

    var that = this;


    this.tweets.location = topojson.feature(this.tweets, this.tweets.objects.tweets).features;

    var current = this.minTime;
    for (var i = 0; i < this.totalHours - 1; i++) {

        current = current + this.hour;

        var res = this.tweets.location.filter(function (d) {
            if (d.properties.time >= current && d.properties.time < current + that.hour)
                return d.properties.time;
        });
        this.timeBucket.push(res);
    }

    // this.tweeting = this.svg.selectAll("circle")
    //                .data(this.timeBucket)
    //                .enter();
}


MapVis.prototype.poping = function (time) {

    var that = this;

    if (time == undefined)
        time = document.getElementById('slider-val').value;


    // console.log(this.timeBucket[0]);

    var fly = this.svg.selectAll("circle")
                  .data(this.timeBucket[time])
                  .enter()
                  .append('circle')
                  .attr("transform", function (d) {

                      return "translate(" + that.path.centroid(d) + ")";

                  })
                    .attr('fill', 'black')
                    .attr("stroke-width", 3)
                    .attr('r', 2)
                    .transition()
                    .duration(3000)
                    .attr("r", Math.pow(1.5, 6))
                    .attr("stroke-width", 50)
                    .style("opacity", .01)
                    .ease('linear')
                    .remove();


    // this.time.text(this.dateFormat(new Date(time * 1000)));
}


