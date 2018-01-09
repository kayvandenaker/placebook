// initial location in string
let nextLoc = $(".card").first().find('.location').text();
let currentLoc = null; // for comparison with nextLoc

let memoSlide;
// html elements in info panel
const infoSpan = $('#info');
const placeSpan = $('#place');
const placeSpan2 = $('#place-2');
const dateSpan = $('#date');
const dateSpan2 = $('#date-2');
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

  $('#info-panel').hover(function() {
    clearTimeout(memoSlide);
    if ($('#info-top').is(":hidden")) {
      $('#info-top').slideDown(150);
    }
  }, function() {
    if ($('#info-top').is(":visible")) {
      $('#info-top').slideUp(300);
    }
  });

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
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
  });

  // listeners (we're here for you)
  google.maps.event.addDomListener(window, 'resize', function() {
    // keeps location in center on resize
    map.setCenter( locate );
  });

  // pan map's center
  //centerOffset(500);
  updateInfoPanel( mIndex );
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
          icon: icon,
          animation: google.maps.Animation.DROP
        });

        // push marker into the array
        gMarkers[i] = marker;

        marker.addListener('click', function() {
          for (let i = 0; i < strArr.length; i++) {
            if (gMarkers[i] === marker){
              locate = marker.getPosition();
              map.panTo( locate );
              gMarkers[i].setIcon( icon2 );
              //gMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
              updateInfoPanel(i);

              currentLoc = null;
            } else if ( gMarkers[i] ) {
              gMarkers[i].setIcon( icon );
              //gMarkers[i].setAnimation(null);
            }
          }
        });

      } else if ( status == "INVALID_REQUEST" ) {
        alert("no memories..");
      } else if ( status == "OVER_QUERY_LIMIT" ) {
        //alert("Too many requests. Calm down!");
        makeMarker( i );
      } else {
        // this location is faulty
        let wCard = $('.card').get( i );
        wCard.className += " wrong-card";
      }

    });
  }
}

// try creating marker again after 1s, loops if status stays "OVER_QUERY_LIMIT"
function makeMarker( i ) {
  setTimeout(() => {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': strArr[i]}, function(results, status) {
      if ( status == 'OK' ) {

        // create marker
        let marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          icon: icon,
          animation: google.maps.Animation.DROP
        });

        // push marker into the array
        gMarkers[i] = marker;

        marker.addListener('click', function() {
          for (let i = 0; i < strArr.length; i++) {
            if (gMarkers[i] === marker){
              locate = marker.getPosition();
              map.panTo( locate );
              gMarkers[i].setIcon( icon2 );
              //gMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
              updateInfoPanel(i);

              currentLoc = null;
            } else if ( gMarkers[i] ) {
              gMarkers[i].setIcon( icon );
              //gMarkers[i].setAnimation(null);
            }
          }
        });

      } else if ( status == "INVALID_REQUEST" ) {
        alert("no memories..");
      } else if ( status == "OVER_QUERY_LIMIT" ) {
        // retry
        makeMarker( i );
      } else {
        // this location is faulty
        let wCard = $('.card').get( i );
        wCard.className += " wrong-card";
      }
    });
  }, 100);
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
  // markers are being validated after 2s
  setTimeout(() => {
    if ( gMarkers.includes(undefined)) {
      // could not create one of the markers
      //alert("Couldn't map all memory locations, check your memory values!");
      locError.slideDown();
    }
  }, 2000);
}

// pan the map to a new location
function panMap() {
  for (let i = 0; i < strArr.length; i++) {
    if ( strArr[i] == nextLoc && gMarkers[i] ) {
      map.panTo( gMarkers[i].getPosition() );
      gMarkers[i].setIcon( icon2 );
    } else if ( strArr[i] == nextLoc && !gMarkers[i] ) {
      //alert("Geocode could not find any results for '" + nextLoc + "'");
    } else if ( gMarkers[i] ) {
      gMarkers[i].setIcon( icon );
    }
  }
  updateInfoPanel(mIndex);
}

function centerOffset(wait) {
  setTimeout(() => {
    let x = -160;
    map.panBy( x, 0)
  }, wait);
}

// update / clear the inforpanel
function updateInfoPanel(index) {
  infoSpan.html( infos[index] );
  placeSpan.html( strArr[index] );
  placeSpan2.html( strArr[index] );
  dateSpan.html( dates[index] );
  dateSpan2.html( dates[index] );

  clearTimeout(memoSlide);
  if ($('#info-top').is(":hidden")) {
    $('#info-top').slideDown(150);
  }
  memoSlide = setTimeout(() => {
    if ($('#info-top').is(":visible")) {
      $('#info-top').slideUp(300);
    }
  }, 3000);
}
function clearInfoPanel() {
  infoSpan.html( '-' );
  placeSpan.html( 'none selected' );
  placeSpan2.html( 'none selected' );
  dateSpan.html( '' );
  dateSpan2.html( '' );
}
// for edit buttons
function editRedirect() {
  location.href = "/" + ids[mIndex] + "/edit";
}
