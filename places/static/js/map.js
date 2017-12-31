// initial location in string
let firstLocation = $(".mapbutton").first().closest('.card').find('#location').text();
// variable to store location in lat, lng (meant to edit over time)
let locate;
// array of places (in strings) to add markers, markers are added after map render
let strArr = [];
// Google map element
var map;

// JQuery
$(document).ready(function(){
  $('.location').each (function () {
    strArr.push($(this).text());
  });

  $(document).on('mouseenter', '.mapbutton', function() {
    nextLoc = $(this).closest('.card').find('#location').text();
    panMap();

    return false;
  });

});

// ------------- GOOGLE MAPS API -------------

function initMap() {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': firstLocation}, function(results, status) {
    if (status == "OK") {
      locate = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: locate,
        fullscreenControl: false,
        minZoom: 2,
        maxZoom: 17,
      });
      map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

      // listeners (we're here for you)
      google.maps.event.addDomListener(window, 'resize', function() {
        // keeps location in center on resize
        map.setCenter(locate);
      });



      addMarkers(map);
    }
    else {
      if ( status == "ZERO_RESULTS" ) {
        alert("Geocode could not find any results for '" + firstLocation + "'");
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }
  });

}

// create markers for all memories
function addMarkers(resultsMap) {
  // load custom icon
  var icon = {
      url: markerImage, // url
      scaledSize: new google.maps.Size(32, 32), // scaled size
  };
  var succeed = true;

  for (let i = 0; i < strArr.length; i++) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': strArr[i]}, function(results, status) {
      if ( status == 'OK' ) {
        // create marker
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          icon: icon
        });
      } else {
        succeed = false;
      }
    });
  }

  // if loop has an error making markers, show alert
  if ( !succeed ) {
    alert('Some markers could not be created, check your memory values');
  }
}

// pan the map to a new location
function panMap() {

  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': nextLoc}, function(results, status) {
    if (status == "OK") {
      locate = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
      map.panTo( locate );
    }
    else {
      if ( status == "ZERO_RESULTS" ) {
        alert("Geocode could not find any results for '" + nextLoc + "'");
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }
  });

}
