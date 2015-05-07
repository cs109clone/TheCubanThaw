$(document).ready(function() {  

  $(window).blur(function() {
      tweet_animation_reset();
  });

  function hard_work()
  {
    alert('4');
  }

  $body = $('body');
  $wrapper = $('.wrapper');

  initFullPage();  
  startVis();
  initPdf();
  
  function initFullPage() {
    $('#fullpage').fullpage({
      // sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff'],
      anchors: ['home', 'tweet-map', 'since-then', 'election-2016', 'process-video', 'process-book'],
      menu: '#menu',
      navigation: true,
      navigationPosition: 'right',
      navigationTooltips: ['Home', 'Tweet Map', 'Since Then', 'Election 2016', 'Process Video', 'Process Book'],
      overflow: true,
      // autoScrolling: false,
      // responsive: 900,
      afterLoad: function(anchorLink, index) {                
        // Update css for specific pages
        if(index == 1){
          $('#fp-nav ul li .fp-tooltip, #fp-nav ul li a span').addClass('home');
        } else {
          $('#fp-nav ul li .fp-tooltip, #fp-nav ul li a span').removeClass('home');
        }
        if(index !== 2){
          tweet_animation_reset();
        }
      },
      afterRender: function(anchorLink, index) {        
        $body.removeClass('loading');
        $wrapper.removeClass('loading');
      }
    });
  }

  function initPdf()
  {
    var pdf = new PDFObject({
      url: 'pdf/process-book.pdf',
      // id: "pdfRendered",
      pdfOpenParams: {
        navpanes: 0,
        toolbar: 0,
        statusbar: 0,
        view: "FitV"
      }
    }).embed("processPdf");    
  }

  function startVis()
  {
    var presidentData = [];
    var nyData = [];
   
    var initVis = function () {
        var MyEventHandler = new Object();
        var pre_vis = new PresidentVis(d3.select("#elections"), presidentData, MyEventHandler);
        var event_vis = new EventVis(d3.select("#sinceThen"), nyData, MyEventHandler);
       
        $(MyEventHandler).bind("runSlide", function (event, data) {

        });
    }

    var dataLoaded = function (error, _presidentData, _nyData) {            
        if (!error) {
            presidentData = _presidentData;
            nyData = _nyData;
            initVis();
        }
    }

    var startHere = function () {
        queue()
              .defer(d3.json, 'data/presidents.json')
              .defer(d3.json, 'data/since.json')
              .await(dataLoaded);
    }
    startHere();
  }

});