
PresidentVis = function (_presElement, _data, _eventHandler) {
    this.presElement = _presElement;
    this.data = _data;

    this.eventHandler = _eventHandler;
    this.displayData = [];

    this.x = 200;
    this.y = 150;

    this.margin = { top: 120, right: 0, bottom: 40, left: 120 },
    this.width = 1000; //getInnerWidth(this.presElement) - this.margin.right - this.margin.left;
    this.height = 650 - this.margin.top - this.margin.bottom;

    this.initVis();
}


PresidentVis.prototype.initVis = function () {

    var that = this;
    this.pres;
    this.name;

    //this.svg2 = this.presElement.append("svg")
    //           .attr("id", "mySvg")
    //           .attr("width", 100)
    //           .attr("height", 100);


    this.svg = this.presElement.append("svg")
                   .style('display', 'block')
                   .style('margin-left', 250)
                   .style('margin-top', -80)
                   .attr("width", this.width)
                   .attr("height", this.height + this.margin.top + this.margin.bottom)
                   .append("g")
                   .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
             
   
    this.tip = d3.tip()
            .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function (d, i) {


                  var result = "<strong>" + d.name.official_full + "</strong><br/>";
                  result += "<span>" + d.bio.party + "</span><br/>";
                  result += "<span> For: " + d.cuba.support + "</span><br/>";

                  return result;
              });

    this.svg.call(this.tip);


    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}


PresidentVis.prototype.wrangleData = function (data) {
    this.displayData = this.data;
}

PresidentVis.prototype.filterData = function (data) {

   /* var res = this.data.filter(function (d) {
        if (d.state === data)
            return d;
    });

    return res;*/
}


PresidentVis.prototype.updateVis = function () {

    var that = this;

   
    var holder = this.svg.append("g")
                
                  .selectAll("g.pres")
                  .data(this.displayData)
                  .enter()
                  .append("g")
                  .attr("class", "pres");

    this.pres = holder
                .append('circle')
                .attr('r', 60)
                .attr('fill', function (d, i) {
                    d3.select(this)
                  .style("fill", "url(#image" + i + ")");

                })
                .attr('cx', function (d, i) {

             
                    return that.x * (i % 5);

                })
                .attr('cy', function (d, i) {
                  

                    return that.y * (i % 4);
                })
                .attr('class', function (d) {
                    return d.cuba.support;

                }).on('mouseover', this.tip.show)
        .on('mouseout', this.tip.hide);


    //this.name = holder
    //           .append('text')
    //           .attr('fill', function (d) {
    //               if (d.bio.party === 'Democrat')
    //                   return '#0d1b28';
    //               else if (d.bio.party === 'Republican')
    //                   return '#660000';
    //               else
    //                   return '#008000';
    //           })
        
    //            .text(function (d) { return d.name.official_full })
                
                
    //             .attr('x', function (d, i) {

    //                // console.log(i % 5)
    //                 return that.x * (i % 5) - 45;

    //             })
    //            .attr('y', function (d, i) {
    //               // console.log(i % 4)

    //                return that.y * (i % 4)  + 80;
    //            });

}

PresidentVis.prototype.onSelectionChange = function (data) {
    if (this.senators !== undefined) {
        this.senators.remove();
        this.picSenators.remove();
        this.prev.remove();
        this.next.remove();
        this.representative.remove();
        this.picRep.remove();
        this.prevRep.remove();
        this.nextRep.remove();
    }

    this.wrangleData(data);
    this.updateVis();
}


PresidentVis.prototype.position = function (d) {
    if (d === 0) {
        this.pres
            .attr('opacity', function (d) {
                if (d.cuba.support ==='yes')
                    return 0.7
                else if (d.cuba.support === 'no')
                    return 1;
            });
    }

    else {
        this.pres
            .attr('opacity', function (d) {
                if (d.cuba.support == 'yes')
                    return 1
                else if (d.cuba.support === 'no')
                    return 0.7
            });

    }
        

};
