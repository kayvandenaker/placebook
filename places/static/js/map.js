let current = 0;
let locs = [];
// coordinates for when no memories are available (= cool)
let coordinates = [
  [2.33, 48.87],
  [50.43, 30.52],
  [52.35, 4.92],
  [38.88,-77],
  [45.42, -75.7],
  [39.91, 116.38],
  [9.93,-84.08]
];

// arrays
let strArr = [];

// jQuery ready
$(document).ready(function(){
  $('.location').each (function () {
    strArr.push($(this).text());
  });

  // When mapbutton pressed, determine index
  $(document).on('click', '.mapbutton', function() {

    current = $(this).closest('.card').index();
    initMap();
  });
});

// ------------- initialize map -------------
function initMap() {
  console.log(strArr.length);
  geocodeLocs();
  console.log(locs.length);
  console.table(locs);

  if ( locs[current] ) {
    location = locs[current];
  } else {
    index = Math.floor((Math.random() * coordinates.length));
    location = { lat : coordinates[index][0], lng : coordinates[index][1] };
  }

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: location,
    fullscreenControl: false,
    minZoom: 2,
    maxZoom: 17,
  });
  map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

  addMarkers(map);

  if ( locs.length > 0 ) {
    map.panTo(locs[current]);
    map.setZoom( 6 );
  } else {
    index = Math.floor((Math.random() * coordinates.length));
    var location = { lat : coordinates[index][0], lng : coordinates[index][1] };
  }
}

// convert strArr to 2D array locs [latitude, longitude], create markers
function geocodeLocs() {
  for (let i = 0; i < strArr.length; i++) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': strArr[i]}, function(results, status) {
      if (status === 'OK') {
        locs[i] = results[0].geometry.location;
      } else {
        //alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}

function addMarkers(resultsMap) {
  for (let i = 0; i < locs.length; i++) {
    var marker = new google.maps.Marker({
      map: resultsMap,
      position: locs[i]
    });
  };
}

function geocodeSingle(str) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': str}, function(results, status) {
    if (status === 'OK') {
      return results[0].geometry.location;
    } else {
      //alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
