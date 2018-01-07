// initial location in string
let nextLoc = $(".card").first().find('.location').text();
let currentLoc = null; // for comparison with nextLoc
// html elements in info panel
const infoSpan = $('#info');
const placeSpan = $('#place');
const dateSpan = $('#date');
const bottomDiv = $('#info-bottom');
const locError = $('#locError');
// variable to store location in lat, lng ( changes with functions )
// variable to store memory index
let locate;
let mIndex = 0;

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
    mIndex = $(this).closest('.card').index() - 1;
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

        // add markers once script has found a valid location.
        addMarkers(map);
      } else {
        // nested if for errors
        if ( status == "ZERO_RESULTS" ) {
          //alert("Geocode could not find any results for '" + nextLoc + "'");
          mIndex++;
          if ( strArr[mIndex] ){
            nextLoc = strArr[mIndex];
            locate = getLocation( nextLoc );
          } else {
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
        } else if ( status == "INVALID_REQUEST" ) {
          // no memories
        } else if ( status == "OVER_QUERY_LIMIT" ) {
          alert("Too many requests. Calm down!");
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      }
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
  updateInfoPanel( mIndex );

  // listeners (we're here for you)
  google.maps.event.addDomListener(window, 'resize', function() {
    // keeps location in center on resize
    map.setCenter( locate );
  });

  validateMarkers();
}

// create markers for all memories
function addMarkers( resultsMap ) {
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

      }
    });
  }
}

function getLocation( loc ) {
  geocoder.geocode({'address': loc}, function(results, status) {
    if ( status == 'OK' ) {
      locate = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
    } else {
      mIndex++;
      if ( strArr[mIndex] ) {
        nextLoc = strArr[mIndex];
        locate = getLocation( nextLoc );
      } else {
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
    }
  });

  initMap();
  return locate;
}

function validateMarkers() {
  setTimeout(() => {
    if ( gMarkers.includes(undefined)) {
      // could not create one of the markers
      //alert("Couldn't map all memory locations, check your memory values!");
      locError.slideDown();
    }
  }, 500);
}

// pan the map to a new location
function panMap() {
  for (let i = 0; i < strArr.length; i++) {
    if ( strArr[i] == nextLoc && gMarkers[i] ) {
      map.panTo( gMarkers[i].getPosition() );
      gMarkers[i].setIcon( icon2 );
    } else if ( strArr[i] == nextLoc && !gMarkers[i] ) {
        alert("Geocode could not find any results for '" + nextLoc
         + "'");
    } else if ( gMarkers[i] ) {
        gMarkers[i].setIcon( icon );
    }
  }

  updateInfoPanel(mIndex);
}

// update / clear the inforpanel
function updateInfoPanel(index) {
  infoSpan.html( infos[index] );
  placeSpan.html( strArr[index] );
  dateSpan.html( dates[index] );
}
function clearInfoPanel() {
  infoSpan.html( '-' );
  placeSpan.html( 'none selected' );
  dateSpan.html( '' );
}
// for edit buttons
function editRedirect() {
  location.href = "/" + ids[mIndex] + "/edit";
}
