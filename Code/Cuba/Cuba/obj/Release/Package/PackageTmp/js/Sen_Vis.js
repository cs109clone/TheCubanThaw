
SenVis = function (_senElement, _data, _eventHandler) {
    this.senElement = _senElement;
    this.data = _data;

    this.eventHandler = _eventHandler;
    this.displayData = [];


    this.margin = { top: 10, right: 10, bottom: 30, left: 50 },
    this.width = getInnerWidth(this.senElement) + 100;
    this.height = 250;


    this.initVis();
}


SenVis.prototype.initVis = function () {

    var that = this;
    this.senBars;
    this.bars;

    this.svg = this.senElement.append('svg')
               .attr('width', this.width + this.margin.left + this.margin.right)
               .attr('height', this.height + this.margin.top + this.margin.bottom)
               .append('g')
               .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.senators = d3.select("#politician").append('div').attr('class', 'senators');

    this.x = d3.scale.ordinal();

    this.y = d3.scale.linear()
      .range([this.height, 0]);

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


    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}

SenVis.prototype.wrangleData = function (data) {

    if (data === undefined)
    {

        this.displayData = this.data.filter(function (d) {
            if (d.type === 'sen')
                return d;
        });
    }
    else {

        this.displayData = this.data.filter(function (d) {
            if (d.type === 'sen' && d.state === data)
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


SenVis.prototype.updateVis = function () {

    var that = this;
    
    this.x.domain(['For', 'Against']).range([0, 60]);

    this.y.domain([0, 80]);

    this.svg.select(".y.axis")
        .call(this.yAxis)

    var senData = [this.displayData.for.length, this.displayData.against.length];

    this.senBars = this.svg.append("g")
                   .selectAll("g.row")
                   .data(senData)


    this.senBars.enter()
                   .append("g")
                   .attr("class", "row")

    this.bars = this.senBars
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

    this.senBars.exit().remove();


}

SenVis.prototype.onChange = function (value) {

    this.wrangleData(value);
    this.updateVis();
    this.senatorsInfo(value);
}

SenVis.prototype.senatorsInfo = function (value) {

    if (value !== undefined) {

        $('.sens').remove();

        var sen = this.senators.selectAll('div')
                   .data(this.displayData)

            sen.enter()
                   .append('div')
                   .attr("class", "sens");


        var pic = sen.
                 append('div')
                 .attr('class', 'sen-pic')
                 .append('img')
                 .attr('src', function (d) {
             
                     return 'https://www.govtrack.us/data/photos/' + d.govtrack_id + '-200px.jpeg';
                 })
                .attr('width', 100)
                .attr('height', 120);

        var info = sen
                   .append('div')
                   .attr('class', 'sen-info')

        var name = info
                   .append('span')
                   .attr('class', 'sen-name')
                   .text(function (d) {
                       return d.first_name + ' ' + d.last_name;
                   })

        var party = info
                   .append('span')
                   .attr('class', 'sen-name')
                   .text(function (d) {
                       return  d.party;
                   })

        var opinion = info
                  .append('span')
                  .attr('class', 'sen-name')
                  .text(function (d) {
                      if(d.position === 'f')
                          return 'For';
                      else {
                          return 'Against';
                      }
                  })
    }
}