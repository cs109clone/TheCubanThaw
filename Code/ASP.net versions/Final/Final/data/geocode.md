
### Geocoding

Geographic information was used with the maximum resolution
available from the Twitter data stream. While we requested
already-geocoded data from Twitter, surprisingly few
tweets came back with legitimate location coordinates. When
coordinates were available, they were typically of the
"Polygon" style, describing not a point, but an area.
Any Polygon location coordinates we collapsed to the
geometric center ("[centroid](http://en.wikipedia.org/wiki/Centroid)")
of the polygon using standard techniques.

![centroid](http://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Triangle.Centroid.svg/182px-Triangle.Centroid.svg.png)

While Twitter often failed to provide precise location coordinates, in
contrast it almost always provided each user's self-reported location, which
can be thought of as each user's "home base." Examples include:

  1. Cauquenes - Chile
  2. Boise, Idaho
  3. Johannesburg, SOUTH AFRICA
  4. Scotland

While many are not precise to a street level, many are quite specific
as to city location.

We then used the Python [geocoder](https://pypi.python.org/pypi/geocoder)
module to access an array of freely available web services provided by
companies such as ArcGIS, Google, MapQuest, OpenCage, TomTom, Yahoo, and
Yandex.

![geocoder image](http://i.imgur.com/vUJKCGl.png)

These services either tranformed each textual location name / description
into corresponding latitude and longitude coordinates, or reported failure
in the attempt. In cases where no textual location was specified, or where
the geocoder could not conclude the latitude/longitude from the text
provided (occasionaly with some manual assistace), we discarded the data
point and did not display it on the map.

Because so many locations needed to be generated, it was import to use
multiple geocoding services, so that we did not overload any one free
service.


Once available to our web application in CSV and JSON formats,
we used standard [D3.js geographic projection functions](https://github.com/mbostock/d3/wiki/API-Reference#d3geo-geography)
to map latitude and longitude into SVG display locations.

The size, color, and styling of display elements are
dynamically chosen based on data attributes of each tweet.
The radius of a tweet is log-proportional to
the number of followers a tweeter has, giving an idea of the
"reach" of the message. Whether a tweet is a retweet / retransmission
of another message is also visually signaled (in yellow).

### Timeline

Tweets are displayed according to the time that they appear in the
Twitter datastream. Tweets may occasionally stop displaying, or
appear to pause. This is not an issue with the visualization, but
rather a reflection of the fact that the Twitter data stream
(at least as exported to us) lacks records for certain seconds.

For example, for one data file, the stream contains records for the
following seconds:

    0-44,59-539,553-562,568-599

But lacks them for seconds:

    45-58,540-552,563-567

