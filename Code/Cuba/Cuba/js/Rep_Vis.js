
RepVis = function (_repElement, _data, _eventHandler) {
    this.repElement = _repElement;
    this.data = _data;

    this.eventHandler = _eventHandler;
    this.displayData = [];


    this.margin = { top: 10, right: 10, bottom: 30, left: 50 },
    this.width = getInnerWidth(this.repElement) + 100;
    this.height = 250;


    this.initVis();
}


RepVis.prototype.initVis = function () {

    var that = this;
    this.repBars;
    this.bars;

    this.svg = this.repElement.append('svg')
               .attr('width', this.width + this.margin.left + this.margin.right)
               .attr('height', this.height + this.margin.top + this.margin.bottom)
               .append('g')
               .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.svgState = this.repElement.append('svg')
               .attr('width', this.width + this.margin.left + this.margin.right)
               .attr('height', (this.height + this.margin.top + this.margin.bottom))
               .append('g')
               .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');



    this.x = d3.scale.ordinal();
  

    this.y = d3.scale.linear()
      .range([this.height, 0]);


    this.xState = d3.scale.ordinal();

    this.yState = d3.scale.linear()
      .range([this.height, 0]);

    this.xAxisState = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxisState = d3.svg.axis()
      .scale(this.yState)
      .orient("left");

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total");

    this.svgState.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -20)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total");


    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}

RepVis.prototype.wrangleData = function (data) {


    if (data === undefined) {

        this.displayData = this.data.filter(function (d) {
            if (d.type === 'rep')
                return d;
        });
    }
    else {

        this.displayData = this.data.filter(function (d) {
            if (d.type === 'rep' && d.state === data)
                return d;
        });

    }

    this.displayData.for = this.displayData.filter(function (d) {
        if (d.position === 'f')
            return d;
    });

    this.displayData.against = this.displayData.filter(function (d) {
        if (d.position === 'a')
            return d;
    });
}


RepVis.prototype.updateVis = function () {

    var that = this;
    this.x.domain(['For', 'Against']).range([0, 60]);

    this.y.domain([0, 300]);

    this.svg.select(".y.axis")
        .call(this.yAxis)

    var repData = [this.displayData.for.length, this.displayData.against.length];


    this.repBars = this.svg.append("g")
                   .selectAll("g.row")
                   .data(repData)


    this.repBars.enter()
                   .append("g")
                   .attr("class", "row")

    this.bars = this.repBars
                    .append("rect")
                    .attr("height", function (d) {

                        return that.height - that.y(d);
                    })
                    .attr("y", function (d) {
                        return that.y(d)
                    })
                    .attr("width", 35)
                    .attr("x", function (d, i) {
                        return ((i + 1) * 40);
                    })
                    .attr("fill", "black");

    this.repBars.exit().remove();


}

RepVis.prototype.onChange = function (value) {

    this.wrangleData(value);
    this.updateVis();
    this.repByState(value);
}

RepVis.prototype.repByState = function (value) {

    $('.rep').remove();
    console.log(value);

    console.log(this.displayData);

    var that = this;
    this.xState.domain(['For', 'Against']).range([0, 60]);

    var max = d3.max([this.displayData.for.length, this.displayData.against.length], function (d) {
        return d;
    })

    this.yState.domain([0, max]);

    this.svgState.select(".y.axis")
        .call(this.yAxisState)

    var repData = [this.displayData.for.length, this.displayData.against.length];


    var repBars = this.svgState.append("g")
                   .selectAll("g.rep")
                   .data(repData)


    repBars.enter()
                   .append("g")
                   .attr("class", "rep")

    var bars = repBars
                    .append("rect")
                    .attr("height", function (d) {

                        return that.height - that.yState(d);
                    })
                    .attr("y", function (d) {
                        return that.yState(d)
                    })
                    .attr("width", 35)
                    .attr("x", function (d, i) {
                        return ((i + 1) * 40);
                    })
                    .attr("fill", "black");
}