
MapVis = function (_parentElement, _data, _tweets, _eventHandler) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.tweets = _tweets;

    this.eventHandler = _eventHandler;
    this.displayData = [];
    

    
    this.dateFormat = d3.time.format("%B %d %H:%M %p");
    this.margin = { top: 20, right: 20, bottom: 30, left: 0 },
    this.width = 550 - this.margin.left - this.margin.right + 200;
    this.height = 500 - this.margin.top - this.margin.bottom;

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

    this.sortedTweets = this.tweets.objects.tweets.geometries.sort(function (a, b) {
        return d3.ascending(a.properties.time, b.properties.time);
    });

    var that = this;
    this.anime;
    this.tweeting;
    this.states;

    this.democratColor = d3.scale.linear()
        .domain([50, 100])
        .range(["#abbdcf", "#0d1b28"]);

    this.republicanColor = d3.scale.linear()
        .domain([50, 100])
        .range(["#ff7f7f", "#660000"]);
        //.interpolate(d3.interpolateLab);

    this.block = this.parentElement.append('div')
                 .attr('class', 'range-style')

    this.play = this.block.append('span')
                .attr('class', 'play-button')
                .text('Play')
                .on('click', function () {
                    that.animate();
                });

    this.range = this.block.append('input')
                .attr('type', 'range')
                .attr('min', this.minTime)
                .attr('max', this.maxTime)
                .attr('step', 3600)
                .attr('class', 'time-slider')
                .attr('value', this.minTime)
                .attr('id', 'slider-val')
                .on('input', function () {
                    that.popTweets();
                });

    this.time = this.block.append('span')
                    .attr('class', 'time')
                    .text(this.dateFormat(new Date(this.minTime * 1000)))

    this.svg = this.parentElement.append("svg")
         .attr('class', 'map-vis')
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
       

    

    this.projection = d3.geo.albersUsa()
    .scale(1000)
    .translate([this.width / 2, this.height / 2]);

    this.path = d3.geo.path().projection(this.projection);
    

    this.options = this.parentElement.append('div')
                 .attr('class', 'choice')
 
    this.presidential = this.options
                .append('button')
                .on('click', function () {
                    that.presidentialData();
                })
                .attr('class', 'button-choice')
                .text('Presidential')


    this.sentimental = this.options
                .append('button')
                .on('click', function () {
                    that.sentimentalData();
                })
                .attr('class', 'button-choice')
                .text('Sentimental')

                




    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}




MapVis.prototype.wrangleData = function () {

    this.displayData = this.data;
    
    this.displayData.states = topojson.feature(this.displayData, this.displayData.objects.states).features;
    this.tweets.location = topojson.feature(this.tweets, this.tweets.objects.tweets).features;

 

    //this.displayData.counties = topojson.feature(this.data, this.data.objects.counties).features;

}


MapVis.prototype.updateVis = function () {

    var that = this;

    this.states = this.svg.selectAll('path')
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

   
    this.tweeting = this.svg.selectAll("circle")
                  .data(that.tweets.location)
                  .enter();
}


MapVis.prototype.animate = function () {
     
    var that = this;

    if (this.play[0][0].innerText === 'Play') {

        this.play.attr('class', 'stop-button').text('Stop');
        this.anime = setInterval(function () {
            var current = parseInt(document.getElementById('slider-val').value);
            
            that.popTweets(current);
            document.getElementById('slider-val').value = parseInt(document.getElementById('slider-val').value) + 3600;


            if (current + 3600 >= that.maxTime) {
                clearInterval(that.anime)
                that.play.attr('class', 'play-button').text('Play');
                document.getElementById('slider-val').value = that.minTime;
            }
           
        }, 1000)
    }
    else {
        this.play.attr('class', 'play-button').text('Play');
        clearInterval(this.anime)
    }
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

             .attr('fill', 'green')
             .attr("stroke-width", 3)
             .attr('r', 8)
             .transition()
             .duration(3000)
             .attr("r", Math.pow(1.5, 5))
             .attr("stroke-width", 50)
             .style("opacity", .01)
             .ease('linear')
             .remove();

    this.time.text(this.dateFormat(new Date(time * 1000)));
}


MapVis.prototype.sentimentalData = function () {
    var that = this;

    console.log('bla');

    this.states.remove();
    this.states = this.svg.selectAll('path')
                .data(this.displayData.states)
                .enter().append("path")
                .attr("d", this.path)
                .attr('fill', function (d) {
                    if (d.properties.obama_rate > d.properties.romney_rate)
                        return that.democratColor(d.properties.romney_rate);
                    else
                        return that.republicanColor(d.properties.obama_rate);
                })
                .attr('class', 'states');
}

MapVis.prototype.presidentialData = function () {
    var that = this;

    console.log('bla');

    this.states.remove();
    this.states = this.svg.selectAll('path')
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
}


