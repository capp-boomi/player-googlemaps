// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var marker;
var laturl;
var lngurl;

//set map variables
function initialize() {
    console.log('testing the map');
    var mapOptions = {
        zoom: 18
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Try HTML5 geolocation to get location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);

            var marker = new google.maps.Marker({
                map: map,
                position: pos,
                title: 'Place',
                draggable: true,
            });

            //gets the pre-drag lat/long coordinates as a pair
            document.getElementById("latbox").innerHTML = marker.getPosition().lat();

            //gets the pre-drag latlong coordinate
            document.getElementById("latbox").innerHTML = marker.getPosition().lat();
            document.getElementById("longbox").innerHTML = marker.getPosition().lng();
            var laturl = marker.getPosition().lat();
            var lngurl = marker.getPosition().lng();

            //gets the new latlong if the marker is dragged		  
            google.maps.event.addListener(marker, "drag", function () {
                document.getElementById("latbox").innerHTML = marker.getPosition().lat();
                document.getElementById("longbox").innerHTML = marker.getPosition().lng();
                var laturl = marker.getPosition().lat();
                var lngurl = marker.getPosition().lng();
            });

            map.setCenter(pos);
        }, function () {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }

}

//if it all fails
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
    };

    var marker = new google.maps.Marker(options);
    map.setCenter(options.position);


}

google.maps.event.addDomListener(window, 'load', initialize);
