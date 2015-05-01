
EventVis = function (_presElement, _data, _eventHandler) {
    this.presElement = _presElement;
    this.data = _data;

    this.eventHandler = _eventHandler;
    this.displayData = [];
    this.articleData = [];

    this.x = 150;
    this.y = 150;

    this.dateFormat = d3.time.format("%m/%d/%Y");

    this.margin = { top: 0, right: 40, bottom: 60, left: 40 },
    this.width = getInnerWidth(this.presElement) - this.margin.left - this.margin.right,
    this.height = 600 - this.margin.bottom - this.margin.top;

    this.initVis();
}


EventVis.prototype.initVis = function () {

    var that = this;
    
    this.svg = this.presElement.append("svg")
                   .attr("width", this.width + this.margin.left + this.margin.right)
                   .attr("height", this.height + this.margin.top + this.margin.bottom)
                   .append("g")
                   .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.articleBlock = d3.select('#eventArticles');

    this.x = d3.time.scale().range([0, this.width]);

    this.y = d3.scale.linear()
      .range([this.height, 0]);

    this.xAxis = d3.svg.axis().scale(this.x).orient("bottom").ticks(10).tickFormat(d3.time.format("%m/%d/%Y"));

    this.yAxis = d3.svg.axis()
     .scale(this.y)
     .orient("left");

  
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")

    this.brush = d3.svg.brush()
    .x(this.x)
    .on("brush", function (d) {  that.brushed() });

   

    /*this.brush = d3.svg.brush()
      .on("brush", function () {
          // Trigger selectionChanged event. You'd need to account for filtering by time AND type
          // console.log(that.brush.extent());
      });*/


    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}


EventVis.prototype.wrangleData = function (data) {
    this.displayData = this.data;
   // console.log(this.displayData);
}



EventVis.prototype.updateVis = function () {

    var that = this;

    var max = d3.max(this.displayData, function (d) {
        return parseInt(d.word_count);
    });


    this.y.domain([0, max + 200]);



    this.x.domain(d3.extent(this.displayData, function (d) { return new Date(d.pub_date); }));



    this.svg.select(".x.axis")
        .call(this.xAxis).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.50em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-50)"
            });


    var events = this.svg.selectAll("circle")
                .data(this.displayData)
                .enter()
                .append('circle')
                .attr('fill', 'black')
                .attr("stroke-width", 3)
                .attr('r', 10)
                .attr('cx', function (d, i) {
                   
                    return that.x(new Date(d.pub_date));

                })
                .attr('cy', function (d) {
                    return that.y(d.word_count);
                })

    this.svg.append("g")
       .attr("class", "brush")
       .call(this.brush)
       .selectAll('rect')
       .attr('height', this.height)
       .style('opacity', 0.3);
}

EventVis.prototype.updateArticles = function () {

    $('.art').remove();
    var article = this.articleBlock.selectAll('div')
                  .data(this.articleData)
                  .enter();

   
     var details = article.append('div')
                          .attr('class', 'art');

     var headline = details.append('span');
     var pub_date = details.append('span');
     var source = details.append('span');

}

EventVis.prototype.brushed = function () {
    var that = this;
    var selected = that.brush.extent();

    console.log(this.displayData);

    this.articleData = this.displayData.filter(function (d) {
        var pub_date = new Date(d.pub_date);
        if (pub_date >= selected[0] && pub_date <= selected[1]) {
            console.log(d);
            return d;
        }
    });

    this.updateArticles();
}
