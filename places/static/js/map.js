// initial location in string
let nextLoc = $(".card").first().find('.location').text();
let currentLoc = null; // for comparison with nextLoc
// html elements in info panel
const infoSpan = $('#info');
const placeSpan = $('#place');
const dateSpan = $('#date');
const bottomDiv = $('#info-bottom');
// variable to store location in lat, lng ( changes with functions )
let locate;

// Google map elements
let map;
let gMarkers = [];
let icon, icon2;


// JQuery
$(document).ready(function () {
  // $('.location').each (function () {
  //   strArr.push($(this).text());
  // });

  $(document).on('click', '#click1', function() {
    // change nextLoc and pan the map to it
    nextLoc = $(this).find('.location').text();
    panMap();

    let editBar = $(this).closest('.card').find('.card-bottom');
    $('.card-bottom').not( editBar ).slideUp( 100 );
    if (editBar.is(":hidden")) {
      editBar.slideDown( 100 );
    }

    return false;
  });
});

// ------------- GOOGLE MAPS API -------------

function initMap() {
  // setup autocomplete
  if ( document.getElementById('id_place') ) {
    let input = document.getElementById('id_place');
    let options = {
     types: ['(cities)'],
    };
    let autocomplete = new google.maps.places.Autocomplete( input, options );
  }

  // load custom icons
  icon = {
      url: markerImage, // url defined in template (static)
      scaledSize: new google.maps.Size(38, 38), // scale icon size
  };
  icon2 = {
      url: markerImageLight, // url defined in template (static)
      scaledSize: new google.maps.Size(38, 38), // scale icon size
  };

  // see if there exist any memories (by nextLoc)
  if ( nextLoc ) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': nextLoc }, function(results, status) {
      if ( status == "OK" ) {
        locate = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
        map.setCenter( locate );

      } else {
        // nested if for errors
        if ( status == "ZERO_RESULTS" ) {
          alert("Geocode could not find any results for '" + firstLocation + "'");
        } else if ( status == "INVALID_REQUEST" ) {
          // no memories (probably)
        } else if ( status == "OVER_QUERY_LIMIT" ) {
          alert("Too many requests. Calm down!");
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      }

      // for some reason, if this is places outside of th geocode function,
      // it will run on an empty strArr, and thus creating no markers.
      // might have something to do how the jquery retrieves the strArr values
      addMarkers(map);
    });
  } else {
    // choose a random location from coordinates
    let coordinates = [
     [2.33, 48.87],
     [50.43, 30.52],
     [52.35, 4.92],
     [38.88,-77],
     [45.42, -75.7],
     [39.91, 116.38],
     [9.93,-84.08]
    ];
    index = Math.floor((Math.random() * coordinates.length));
    locate = { lat : coordinates[index][0], lng : coordinates[index][1] };
  }

  // create map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: locate,
    fullscreenControl: false,
    disableDoubleClickZoom: true,
    gestureHandling: 'greedy',
    minZoom: 2,
    maxZoom: 17,
  });
  map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

  // listeners (we're here for you)
  google.maps.event.addDomListener(window, 'resize', function() {
    // keeps location in center on resize
    map.setCenter( locate );
  });

  map.addListener('click', function() {
    clearInfoPanel();
    for (let i = 0; i < gMarkers.length; i++) {
      if ( gMarkers[i] ) {
          gMarkers[i].setIcon( icon );
      }
    }
    currentLoc = null;
  });

}

// create markers for all memories
function addMarkers( resultsMap ) {
  let succeed = true;

  for (let i = 0; i < strArr.length; i++) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': strArr[i]}, function(results, status) {
      if ( status == 'OK' ) {
        // create marker
        let marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location,
          icon: icon
        });
        // push marker into the array
        gMarkers[i] = marker;

        marker.addListener('click', function() {
          for (let i = 0; i < gMarkers.length; i++) {
            if (gMarkers[i] === marker){
              locate = marker.getPosition();
              map.panTo( locate );
              gMarkers[i].setIcon( icon2 );
              updateInfoPanel(i);
              currentLoc = null;
            } else if ( gMarkers[i] ) {
                gMarkers[i].setIcon( icon );
            }
          }

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
  // only use the geocoder if value is changed
  // ( pressing same button twice shouldnt use it )
  for (let i = 0; i < strArr.length; i++) {
    if ( strArr[i] == nextLoc ) {
      map.panTo( gMarkers[i].getPosition() );
      gMarkers[i].setIcon( icon2 );
      updateInfoPanel(i);
    } else if ( gMarkers[i] ) {
        gMarkers[i].setIcon( icon );
    }
  }
}

function selectMarker( loc ) {
  // find right index by strArr and use it to change the markers array
  for (let i = 0; i < strArr.length; i++) {
    if ( strArr[i] == nextLoc ) {
      gMarkers[i].setIcon( icon2 );
      updateInfoPanel(i);
    } else if ( gMarkers[i] ) {
        gMarkers[i].setIcon( icon );
    }
  }
}

function updateInfoPanel(index) {
  infoSpan.html( infos[index] );
  placeSpan.html( strArr[index] );
  dateSpan.html( dates[index] );
  bottomDiv.show();
}
function clearInfoPanel() {
  infoSpan.html( '-' );
  placeSpan.html( 'none selected' );
  bottomDiv.hide();
}
