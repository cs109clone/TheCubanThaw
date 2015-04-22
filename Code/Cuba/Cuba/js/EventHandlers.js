


EventHandler = function (_eventHandler) {

    this.eventHandler = _eventHandler;
    this.init();
}


EventHandler.prototype.init = function () {

    var that = this;

    this.play = d3.select('#play').on("click", function (d) {
        $(that.eventHandler).trigger("runSlide", 'hi');

    });
     
}




