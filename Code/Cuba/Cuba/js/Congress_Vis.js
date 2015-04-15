
CongressVis = function (_parentElement, _data, _eventHandler) {
    this.parentElement = _parentElement;
    this.data = _data;
   // this.tweets = _tweets;

    console.log(this.data);
    this.eventHandler = _eventHandler;
    this.displayData = [];



    this.dateFormat = d3.time.format("%B %d %H:%M %p");
    this.margin = { top: 500, right: 20, bottom: 30, left: 500 },
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 700 - this.margin.top - this.margin.bottom;

    this.initVis();
}


CongressVis.prototype.initVis = function () {

    var that = this;

    this.svg = this.parentElement.append("svg")
        .attr('class', 'congress-vis')
       .attr("width", this.width + this.margin.left + this.margin.right)
       .attr("height", this.height + this.margin.top + this.margin.bottom)
       .append("g")
       .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    this.arc = d3.svg.arc()
                .innerRadius(100)
                .outerRadius(400)
                .startAngle(1)
                .endAngle(Math.PI - 4);

    this.pie = d3.layout.pie()
                    .value(function (d, i) {
                        return 1;
                    });

    var canvas = this.svg.append('circle')
                .attr('d', this.arc)
                .attr('fill', 'yellow');

    var data = [1, 2, 3, 4, 5];

    console.log(that.arc.centroid(data)[0]);
    console.log(that.arc.centroid(data)[0]);

    var circle = canvas.selectAll('circle')
               .data(data)
               .enter()
               .append('circle')
    circle.attr('fill', 'blue')
    .attr("cx", function (d) {

        return that.arc.centroid(d)[0];

    })
    .attr("cy", function (d) {

        return that.arc.centroid(d)[1];

    })
    .attr('r', 20)


   
    /*
    data = this.pie(data).map(function (d, i) {

        d.innerRadius = 0;
        d.outerRadius = 100;


        d.data.x = that.arc.centroid(d)[0];
        d.data.y = that.arc.centroid(d)[1];



        console.log(d.data.x);
        return d;
    });

    console.log(data);

    var circle = canvas.selectAll('circle')
                .data(this.pie(data))
                .enter()
                .append('circle')
    circle.attr('fill', 'blue')
    .attr("transform", function (d) {

        //console.log(d);
           // return "translate(" + that.path.centroid(d) + ")";
        
    })
    .attr('r', 20)

    
    */
   



    

    
                

    
    





    //console.log(this.tweets.objects.tweets.geometries[0].properties.time);

   /* this.minTime = d3.min(this.tweets.objects.tweets.geometries, function (d) {
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
    this.updateVis();*/
}




CongressVis.prototype.wrangleData = function () {

    this.displayData = this.data;

    console.log(this.displayData);

  



    //this.displayData.counties = topojson.feature(this.data, this.data.objects.counties).features;

}


CongressVis.prototype.updateVis = function () {

}



