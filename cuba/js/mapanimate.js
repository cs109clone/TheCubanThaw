// ================= Animation code =================

var byseconds;  // second by second list of lists of animatable events
                // each location is a list of animatable events for that
                // moment
var seconds;    // list of seconds on the timeline for which animatable
                // events exist
var radius_scale = d3.scale.log().base(3),  // maps follower count to SVG radius
    stroke_scale = d3.scale.log().base(2), // maps favoite counts to SVG stroke withd
    factor = 20,   // how much faster than real time should animation run?
    pause = 0,     // should the animation pause?
    ntweets = 0;   // number of tweets animated

    // set pause to 1 to pause
    // call animate_by_second(pause) to restart


function tweet_animation_on(btn) {
    console.log("clicking on");
    btn_on();
    pause = 0;
    animate_by_second(pause);
    // d3.select("#pauseplay").on('click', tweet_animation_off);
}

function tweet_animation_off(btn) {  
    console.log("clicking off");
    btn_off();
    pause = 1;
    // d3.select("#pauseplay").on('click', tweet_animation_on);
}

function tweet_animation_reset() {
  ntweets = 0;
  pause = 1;  
  periodic_updates(0);
  btn_off();
}

function btn_off() {  
  d3.select('#pauseplay').attr('data-value', 'off');
  d3.select('#pauseplay').select('span.text').html('Play');
  d3.select('#pauseplay').select('span.glyphicon').classed({'glyphicon': true, 'glyphicon-play': true, 'glyphicon-pause': false}); 
}

function btn_on() {
  d3.select('#pauseplay').select('span.text').html('Pause');
  d3.select('#pauseplay').select('span.glyphicon').classed({'glyphicon': true, 'glyphicon-pause': true, 'glyphicon-play': false});
  d3.select('#pauseplay').attr('data-value', 'on');
}

d3.select("#pauseplay").on('click', function(e) {
  var state = d3.select(this).attr('data-value');
  if(state == 'off') {
    tweet_animation_on(this);    
  } else if(state == 'on') {
    tweet_animation_off(this);    
  } 
});

d3.select("#stop").on('click', function(e) {  
  tweet_animation_reset();  
})

/*
 * Show a single tweet at the given latitude and longitude, scaled for the
 * Given follower count.
 */
function show_tweet(lat, lng, nfollowers, nfavor, is_rt) {

    var radius = (nfollowers == 0) ? 1 : radius_scale(nfollowers),
        strokew = (nfavor == 0) ? 0 : Math.max(radius_scale(nfavor), 0.5),
        projxy = projection([lng, lat]);
    
    svg.append("circle")
        .attr("cx", projxy[0])
        .attr("cy", projxy[1])
        .attr("r", 0)
        .attr("class", (is_rt == 0 ? "tweet" : "retweet"))
        .attr('stroke', (strokew == 0 ? 'none' : '#9900FF'))
        .attr('stroke-width', 0)
        .transition()       // grow in
        .ease(Math.sqrt)
        .duration(1000)
        .attr("r", radius)
        .attr("stroke-width", strokew + "px")
        .attr("stroke-opacity", 1)
        .transition()
        .duration(1000)   // supernova and dissipate
        .ease(Math.sqrt)
        .attr("r", radius * 1.5)
        .style("fill-opacity", 1e-6)
        .style("stroke-opacity", 1e-6)
        .remove();        // exit stage left
}

/*
 * Function called occasionally for misc display cleanups. Called
 * always at start and end of animation, and before a pause occurs.
 */

function periodic_updates(sec_index) {
  d3.select("#tweets-seen-number").text(ntweets.toLocaleString());
}


/*
 * A handler run once for every animatable second. Displays all of the
 * animatable events for that second, and sets up a callback for the
 * next second.
 */

function animate_by_second(sec_index) {
    events = byseconds[sec_index];
    events.forEach(function(e,i) {
        show_tweet(e[0], e[1], e[2],   e[3],  e[4]);
        //         lat   lng   nfollow nfavor is_rt
    });
    ntweets += events.length;
    var next_index = sec_index + 1;
    if (next_index < byseconds.length) {
        if (pause) {
            pause = next_index;
            periodic_updates(sec_index);
            return;
        }
        if (sec_index % factor == 0) {
            periodic_updates(sec_index);
        }
        var delay = (seconds[next_index] - seconds[sec_index]) / factor;
        setTimeout(function(){ animate_by_second(next_index); }, delay);
    }
    else {      
        // Once more unto the breach, dear friends, once more.
        periodic_updates(sec_index);
        btn_off();
    }
}

/*
 * Start the show. Get JSON. Start the animation.
 */

d3.json("data/coresamp.json", function(error, data) {
    // console.log("data", data);
    // set_time_slider(data, new Date(data.from), new Date(data.to));
    seconds = data.seconds;
    byseconds = data.byseconds;
    ntweets = 0;
    periodic_updates(0);
    // animate_by_second(0);
});
