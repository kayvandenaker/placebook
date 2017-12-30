// let mapdiv = $("#map");
// let val1 = $(".mapbutton").first().closest('.card').find('#location').text().split(' ').join('+');
//
// var map;
// var location;
// var current;
//
// // jQuery ready
// $(document).ready(function(){
//   $(document).on('click', '.mapbutton', function() {
//
//     current = $(this).closest('.card').find('#location').text();
//     console.log(current);
//     //current = $(this).closest('.card').index();
//     codeAddress();
//
//     return false;
//   });
//
//   // $(document).on('click', '.mapbutton', function() {
//   //   val1 = $(this).closest('.card').find('#location').text().split(' ').join('+');
//   //   codeAddress();
//   //
//   //   return false;
//   // });
//
// });
//
// function codeAddress() {
//    var geocoder = new google.maps.Geocoder();
//
//    var address = current;
//    console.log(current);
//    geocoder.geocode( { 'address': address}, function(results, status) {
//      if (status == google.maps.GeocoderStatus.OK) {
//
//        initMap(results[0].geometry.location.lat(), results[0].geometry.location.lng())
//      // alert("Latitude: "+results[0].geometry.location.lat());
//      // alert("Longitude: "+results[0].geometry.location.lng());
//      } else {
//        alert("Geocode was not successful for the following reason: " + status);
//      }
//    });
//  }
//
// function initMap(lat, lng) {
//   //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDRAAmE5TswTx5EnJdwcuUGUv_kkRqtyUM
//
//   location = {"lat": lat, "lng": lng};
//   map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 7,
//     center: location,
//     fullscreenControl: false,
//     minZoom: 2,
//     maxZoom: 17,
//   });
//   map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
//
//   var marker = new google.maps.Marker({
//     position: location,
//     map: map
//   });
// }

let mapdiv = $("#map");
let currentLoc = $(".mapbutton").first().closest('.card').find('#location').text();
let nextLoc;
let strArr = [];

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
  geocoder.geocode( { 'address': currentLoc}, function(results, status) {
    if (status == "OK") {
      var firstLocation = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: firstLocation,
        fullscreenControl: false,
        minZoom: 2,
        maxZoom: 17,
      });
      map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
      addMarkers(map);
    }
    else {
      if ( status == "ZERO_RESULTS" ) {
        alert("Geocode could not find any results");
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }
  });

}

// create markers for all memories
function addMarkers(resultsMap) {
  for (let i = 0; i < strArr.length; i++) {

    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': strArr[i]}, function(results, status) {
      if (status === 'OK') {
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        //alert('Geocode was not successful for the following reason: ' + status);
      }
    });

  }
}

// pan the map to new location
function panMap() {

  geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': nextLoc}, function(results, status) {
    if (status == "OK") {
      var nextLocation = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
      map.panTo( nextLocation );
    }
    else {
      if ( status == "ZERO_RESULTS" ) {
        alert("Geocode could not find any results");
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }
  });

}
