/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */



/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
AreaVis = function (_parentElement, _data, _metaData) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
 
    this.dateFormatter = d3.time.format("%Y-%m-%d");


    // TODO: define all constants here
    this.margin = { top: 0, right: 10, bottom: 30, left: 50 },
    this.width = getInnerWidth(this.parentElement) - this.margin.left - this.margin.right,
    this.height = 250;

    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
AreaVis.prototype.initVis = function () {

    var that = this; // read about the this

    /*this.fromText = this.parentElement
                         .append("span")
                         .text("From: ")
                         .attr("class", "text-date")

    this.startDate = this.parentElement
                         .append('input')
                         .attr("type", "date")
                         .attr('id', 'start-date')

    this.toText = this.parentElement
                         .append("span")
                         .text("To: ")
                         .attr("class", "text-date")

    this.endDate = this.parentElement
                         .append('input')
                         .attr("type", "date")
                         .attr('id', 'end-date')

    this.error = this.parentElement
                         .append('span')
                         .attr('class', 'error-mess')


*/

    //TODO: construct or select SVG
    this.svg = this.parentElement.append('svg')
               //.attr('class', 'area-vis')
               .attr('width', this.width + this.margin.left + this.margin.right)
               .attr('height', this.height + this.margin.top + this.margin.bottom)
               .append('g')
               .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    console.log(this.height);
    this.x = d3.scale.linear()
      .range([0, this.width]);

    this.y = d3.scale.linear()
      .range([this.height, 0]);

    this.area = d3.svg.area()
      .interpolate("monotone")
      .x(function (d, i) { return that.x(i); })
      .y0(this.height )
      .y1(function (d) { return that.y(d); });

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    console.log(this.data);

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")


    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", -10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Tweets Count");

    /*this.svg.append("text")
        .attr("x", (this.width / 9))
        .attr("y", 0 - ((this.margin.top - 20) / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Distribution of Priorities:")
        .attr("class", "graph-title");


    //TODO: create axis and scales

    /*
    this.minTime = d3.min(this.data, function (d) {
        return that.dateFormatter(d.time);
    });



    this.maxTime = d3.max(this.data, function (d) {
        return that.dateFormatter(d.time);
    });

    this.startDate
        .attr('min', this.minTime)
        .attr('max', this.maxTime)
        .attr('value', this.minTime)

    this.endDate
        .attr('min', this.minTime)
        .attr('max', this.maxTime)
        .attr('value', this.maxTime)


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
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")





    this.svg.append("g")
        .attr("class", "y axis")

    this.staticRows;
    this.brushedRows;
    this.brushed = false;

    this.startDate
        .on('input', function () {
            that.onDateSelection();
        });

    this.endDate
        .on('input', function () {
            that.onDateSelection();
        });*/

    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
AreaVis.prototype.wrangleData = function (selectionStart, selectionEnd) {

    this.displayData = this.data;
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
AreaVis.prototype.updateVis = function () {

    var that = this;

    this.x.domain(d3.extent(this.displayData, function (d, i) { return i; }));
    this.y.domain([0, d3.max(this.displayData, function (d) { return d;})]);

    this.svg.select(".x.axis")
        .call(this.xAxis);


    this.svg.select(".y.axis")
        .call(this.yAxis)

    var path = this.svg.selectAll(".area")
      .data([this.displayData])

    path.enter()
      .append("path")
      .attr("class", "area");

    path
      .transition()
      .attr("d", this.area);

    path.exit()
      .remove();
   /* var domain = [];
    var range = [];
    var i = 0;

    while (this.metaData.priorities[i] != undefined) {
        domain.push(this.metaData.priorities[i]['item-title']);
        range.push(i * 40);
        i++;
    }

    var maxStatic = d3.max(this.staticData, function (d) { return d; });
    var maxBrushed = d3.max(this.brushedData, function (d) { return d; });
    var maxUsed = maxBrushed != undefined && maxBrushed > maxStatic ? maxBrushed : maxStatic;

    this.x.domain(domain).range(range);

    this.y.domain([0, maxUsed]);

    this.svg.select(".x.axis")
        .call(this.xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.50em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-65)"
            });

    this.svg.select(".y.axis")
        .call(this.yAxis)

    if (this.staticRows != undefined)
        this.staticRows.remove();

    if (this.brushedRows != undefined)
        this.brushedRows.remove();



    if (maxBrushed == undefined || maxStatic >= maxBrushed) {

        this.staticRows = this.svg.append("g")
                    .selectAll("g.row")
                    .data(this.staticData)
                    .enter()
                    .append("g")
                    .attr("class", "row")


        var bars = this.staticRows
                    .append("rect")
                    .attr("height", function (d) {
                        return that.height - that.y(d);
                    })
                    .attr("y", function (d) {
                        return that.y(d)
                    })
                    .attr("width", 35)
                    .attr("x", function (d, i) {
                        return (i * 40);
                    })
                    .attr("fill", function (d, i) {
                        return that.metaData.priorities[i]['item-color'];

                    });

        this.brushedRows = this.svg.append("g")
                   .selectAll("g.row")
                   .data(this.brushedData)
                   .enter()
                   .append("g")
                   .attr("class", "row")


        var bBars = this.brushedRows
                    .append("rect")
                    .attr("height", function (d) {
                        return that.height - that.y(d);
                    })
                    .attr("y", function (d) {
                        return that.y(d)
                    })
                    .attr("width", 35)
                    .attr("x", function (d, i) {
                        return (i * 40);
                    })
                    .attr("fill", '#D3D3D3');




    }

    else {

        this.brushedRows = this.svg.append("g")
                    .selectAll("g.row")
                    .data(this.brushedData)
                    .enter()
                    .append("g")
                    .attr("class", "row")


        var bBars = this.brushedRows
                    .append("rect")
                    .attr("height", function (d) {
                        return that.height - that.y(d);
                    })
                    .attr("y", function (d) {
                        return that.y(d)
                    })
                    .attr("width", 35)
                    .attr("x", function (d, i) {
                        return (i * 40);
                    })
                    .attr("fill", '#D3D3D3');

        this.staticRows = this.svg.append("g")
                    .selectAll("g.row")
                    .data(this.staticData)
                    .enter()
                    .append("g")
                    .attr("class", "row")


        var bars = this.staticRows
                    .append("rect")
                    .attr("height", function (d) {
                        return that.height - that.y(d);
                    })
                    .attr("y", function (d) {
                        return that.y(d)
                    })
                    .attr("width", 35)
                    .attr("x", function (d, i) {
                        return (i * 40);
                    })
                    .attr("fill", function (d, i) {
                        return that.metaData.priorities[i]['item-color'];

                    });

    }*/
}



AreaVis.prototype.onSelectionChange = function (selectionStart, selectionEnd) {

    // TODO: call wrangle function
    this.brushed = true;
    this.wrangleData(selectionStart, selectionEnd);
    this.updateVis();
}

AreaVis.prototype.onDateSelection = function () {

    var start = document.getElementById('start-date').value;
    var end = document.getElementById('end-date').value;
    if (start > end) {
        this.startDate
            .attr('class', 'invalid-date')

        this.endDate
            .attr('class', 'invalid-date')


        this.error.text(" From date must be smaller than end date or date is invalid!")
            .attr('class', 'mess-error');

    }
    else if (start < this.minTime || start > this.maxTime) {
        this.startDate
            .attr('class', 'invalid-date')

        this.error.text(" From date must be from " + this.minTime + " to " + this.maxTime + ".")
            .attr('class', 'mess-error');

    }
    else if (end < this.minTime || end > this.maxTime) {
        this.endDate
            .attr('class', 'invalid-date')
        this.error.text(" To date must be from " + this.minTime + " to " + this.maxTime + ".")
            .attr('class', 'mess-error');
    }

    else {

        this.startDate
            .attr('value', start)
            .attr("class", "date")

        this.endDate
            .attr('value', end)
            .attr("class", "date")

        this.error
            .attr('class', 'error-mess');

        this.brushed = false;
        this.wrangleData(start, end);
        this.updateVis();
    }
}



AreaVis.prototype.aggregateCountForRange = function (startDate, endDate) {

    var that = this;
    var temp;

    if (startDate == null) {
        startDate = this.minTime
    }

    if (endDate == null) {
        endDate = this.maxTime;
    }

    temp = this.data.filter(function (d) {
        if (that.dateFormatter(d.time) >= startDate && that.dateFormatter(d.time) <= endDate)
            return d;
    });


    // create an array of values for age 0-100
    var res = d3.range(16).map(function () {
        return 0;
    });


    for (var i = 0; i < temp.length; i++) {
        for (var j = 0; j < temp[i].prios.length; j++) {
            res[j] += temp[i].prios[j];
        }
    }
    return res;
}