
PresidentVis = function (_presElement, _data, _eventHandler) {
    this.presElement = _presElement;
    this.data = _data;

    this.eventHandler = _eventHandler;
    this.displayData = [];

    this.x = 150;
    this.y = 150;

    this.margin = { top: 90, right: 0, bottom: 40, left: 250 },
    this.width = getInnerWidth(this.presElement) - this.margin.right - this.margin.left;
    this.height = 650 - this.margin.top - this.margin.bottom;

    this.initVis();
}


PresidentVis.prototype.initVis = function () {

    var that = this;
    this.pres;
    this.name;

    this.svg = this.presElement.append("svg")
                   .style('display', 'block')
                   .attr("width", this.width / 1.4)
                   .attr("height", this.height + this.margin.top + this.margin.bottom)
                   .append("g")
                   .attr("transform", "translate(" + this.margin.left  + "," + this.margin.top + ")");

    this.options = this.presElement.append('div')
                 .attr('class', 'cuba')
                
    this.for = this.options
                .append('button')
                .on('click', function () {
                    that.position(1);
                })
                .attr('class', 'button-choice')
                .text('For')


    this.against = this.options
                .append('button')
                .on('click', function () {
                    that.position(0);
                })
                .attr('class', 'button-choice')
                .text('Against')


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
                .attr('fill', function (d) {
                    d3.select(this)
                  .style("fill", "url(#image)");
                    //if (d.bio.party === 'Democrat')
                    //    return '#0d1b28';
                    //else if (d.bio.party === 'Republican')
                    //    return '#660000';
                    //else
                    //    return '#008000';

                })
                .attr('cx', function (d, i) {

             
                    return that.x * (i % 5);

                })
                .attr('cy', function (d, i) {
                  

                    return that.y * (i % 4);
                })
                .attr('class', function (d) {
                    return d.cuba.support;

                });

    this.name = holder
               .append('text')
               .attr('fill', function (d) {
                   if (d.bio.party === 'Democrat')
                       return '#0d1b28';
                   else if (d.bio.party === 'Republican')
                       return '#660000';
                   else
                       return '#008000';
               })
                .text(function (d) { return d.name.official_full })
                 .attr('x', function (d, i) {

                    // console.log(i % 5)
                     return that.x * (i % 5) - 45;

                 })
                .attr('y', function (d, i) {
                   // console.log(i % 4)

                    return that.y * (i % 4)  + 80;
                });;

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
