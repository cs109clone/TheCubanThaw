
CongressVis = function (_parentElement, _data, _eventHandler) {
    this.parentElement = _parentElement;
    this.data = _data;
    // this.tweets = _tweets;

    console.log(this.data);
    this.eventHandler = _eventHandler;
    this.displayData = [];


    this.margin = { top: 20, right: 20, bottom: 30, left: 10 },
    this.width = 200 - this.margin.left - this.margin.right;
    this.height = 350 - this.margin.top - this.margin.bottom;

    this.initVis();
}


CongressVis.prototype.initVis = function () {

    var that = this;


    this.carousel = this.parentElement.append("div")
                .attr('class', 'carousel-inner')

    this.senators;
    this.picSenators;
    this.prev;
    this.next;
    this.representative;
    this.picRep;
    this.prevRep;
    this.nextRep;



    //this.svg = this.parentElement.append("svg")
    //    .attr('class', 'congress-vis')
    //   .attr("width", this.width + this.margin.left + this.margin.right)
    //   .attr("height", this.height + this.margin.top + this.margin.bottom)
    //   .append("g")
    //   .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");




    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    //this.updateVis();
}






CongressVis.prototype.wrangleData = function (data) {
    if (data != undefined) {
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

    
    //this.displayData.counties = topojson.feature(this.data, this.data.objects.counties).features;

}

CongressVis.prototype.filterData = function (data) {

    var res = this.data.filter(function (d) {
        if (d.state == data)
            return d;
    });

    return res;
}


CongressVis.prototype.updateVis = function () {



    this.senators = this.carousel.selectAll('div')
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

    this.prev = this.carousel
                .append('a')
                .attr('class', 'left carousel-control')
                .attr('href', '#carousel-example-generic')
                .attr('data-slide', "prev")
                .append('span')
                .attr('class', 'icon-prev');

    this.next = this.carousel
                .append('a')
                .attr('class', 'right carousel-control')
                .attr('href', '#carousel-example-generic')
                .attr('data-slide', "next")
                .append('span')
                .attr('class', 'icon-next');

    //this.representative = this.carousel.selectAll('div')
    //          .data(this.displayData.representative)
    //          .enter()
    //          .append('div')
    //          .attr('class', function (d, i) {
    //              if (i == 0)
    //                  return 'item active';
    //              else
    //                  return 'item';
    //          });

    //this.picRep = this.representative
    //          .append('img')
    //          .attr('src', function (d) {

    //              return 'https://www.govtrack.us/data/photos/' + d.govtrack_id + '-200px.jpeg';

    //          })
    //          .attr('alt', "Alt")
    //          .attr('data-in-view', "true");

    //this.prevRep = this.carousel
    //            .append('a')
    //            .attr('class', 'left carousel-control')
    //            .attr('href', '#carousel-example-generic')
    //            .attr('data-slide', "prev")
    //            .append('span')
    //            .attr('class', 'icon-prev');

    //this.nextRep = this.carousel
    //            .append('a')
    //            .attr('class', 'right carousel-control')
    //            .attr('href', '#carousel-example-generic')
    //            .attr('data-slide', "next")
    //            .append('span')
    //            .attr('class', 'icon-next');



    //<a class="left carousel-control" href="#carousel-example-generic" data-slide="prev">
    //                                    <span class="icon-prev"></span>
    //                                </a>
    //                                <a class="right carousel-control" href="#carousel-example-generic" data-slide="next">
    //                                    <span class="icon-next"></span>
    //                                </a>


}

CongressVis.prototype.onSelectionChange = function (data) {
    if(this.senators != undefined)
    {
        this.senators.remove();
        this.picSenators.remove();
        this.prev.remove();
        this.next.remove();
    }
   
    this.wrangleData(data);
    this.updateVis();
}




//<div class="example">
//  <div class="panel-group" id="accordion">
//    <div class="panel panel-default">
//      <div class="panel-heading">
//        <h4 class="panel-title">
//          <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
//            Collapsible Group Item #1
//          </a>
//        </h4>
//      </div>
//      <div id="collapseOne" class="panel-collapse collapse in">
//        <div class="panel-body">
//          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
//        </div>
//      </div>
//    </div>
//    <div class="panel panel-default">
//      <div class="panel-heading">
//        <h4 class="panel-title">
//          <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">
//            Collapsible Group Item #2
//          </a>
//        </h4>
//      </div>
//      <div id="collapseTwo" class="panel-collapse collapse">
//        <div class="panel-body">
//          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
//        </div>
//      </div>
//    </div>
//    <div class="panel panel-default">
//      <div class="panel-heading">
//        <h4 class="panel-title">
//          <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseThree">
//            Collapsible Group Item #3
//          </a>
//        </h4>
//      </div>
//      <div id="collapseThree" class="panel-collapse collapse">
//        <div class="panel-body">
//          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
//        </div>
//      </div>
//    </div>
//  </div>
//</div>

//<div class="panel panel-default">
//                   <div class="panel-heading">
//                       <h4 class="panel-title">
//                           <a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">Collapsible Group Item #2
//                           </a>
//                       </h4>
//                   </div>
//                   <div id="collapseTwo" class="panel-collapse collapse">
//                       <div class="panel-body">
//                           Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
//                       </div>
//                   </div>
//               </div>