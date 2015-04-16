
CongressVis = function (_senElement, _repElement, _data, _eventHandler) {
    this.senElement = _senElement;
    this.repElement = _repElement;
    this.data = _data;

    this.eventHandler = _eventHandler;
    this.displayData = [];


    this.margin = { top: 20, right: 20, bottom: 30, left: 10 },
    this.width = 100 - this.margin.left - this.margin.right;
    this.height = 550 - this.margin.top - this.margin.bottom;

    this.initVis();
}


CongressVis.prototype.initVis = function () {

    var that = this;


    this.senCarousel = this.senElement.append("div")
                .attr('class', 'carousel-inner')

    this.repCarousel = this.repElement.append("div")
                .attr('class', 'carousel-inner')

    this.senators;
    this.picSenators;
    this.prev;
    this.next;
    this.representative;
    this.picRep;
    this.prevRep;
    this.nextRep;


    // filter, aggregate, modify data
    //this.wrangleData();

    // call the update method
    //this.updateVis();
}






CongressVis.prototype.wrangleData = function (data) {
    if (data !== undefined) {
        this.displayData = this.filterData(data);
        this.displayData.senators = this.displayData.filter(function (d) {
            if (d.type === 'sen')
                return d;
        });

        this.displayData.representative = this.displayData.filter(function (d) {
            if (d.type === 'rep')
                return d;
        });
    }
}

CongressVis.prototype.filterData = function (data) {

    var res = this.data.filter(function (d) {
        if (d.state === data)
            return d;
    });

    return res;
}


CongressVis.prototype.updateVis = function () {



    this.senators = this.senCarousel.selectAll('div')
               .data(this.displayData.senators)
               .enter()
               .append('div')
               .attr('class', function (d, i) {
                   if (i == 0)
                       return 'item active';
                   else
                       return 'item';
               });

    this.picSenators = this.senators
              .append('img')
              .attr('src', function (d) {
                  
                      return 'https://www.govtrack.us/data/photos/' + d.govtrack_id + '-200px.jpeg';

              })
              .attr('alt', "Alt")
              .attr('data-in-view', "true");

    this.prev = this.senCarousel
                .append('a')
                .attr('class', 'left carousel-control')
                .attr('href', '#carousel-sen')
                .attr('data-slide', "prev")
                .append('span')
                .attr('class', 'icon-prev');

    this.next = this.senCarousel
                .append('a')
                .attr('class', 'right carousel-control')
                .attr('href', '#carousel-sen')
                .attr('data-slide', "next")
                .append('span')
                .attr('class', 'icon-next');

    this.representative = this.repCarousel.selectAll('div')
               .data(this.displayData.representative)
               .enter()
               .append('div')
               .attr('class', function (d, i) {
                   if (i == 0)
                       return 'item active';
                   else
                       return 'item';
               });

    this.picRep = this.representative
              .append('img')
              .attr('src', function (d) {

                  return 'https://www.govtrack.us/data/photos/' + d.govtrack_id + '-200px.jpeg';

              })
              .attr('alt', "Alt")
              .attr('data-in-view', "true");

    this.prevRep = this.repCarousel
                .append('a')
                .attr('class', 'left carousel-control')
                .attr('href', '#carousel-rep')
                .attr('data-slide', "prev")
                .append('span')
                .attr('class', 'icon-prev');

    this.nextRep = this.repCarousel
                .append('a')
                .attr('class', 'right carousel-control')
                .attr('href', '#carousel-rep')
                .attr('data-slide', "next")
                .append('span')
                .attr('class', 'icon-next');

}

CongressVis.prototype.onSelectionChange = function (data) {
    if(this.senators !== undefined)
    {
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