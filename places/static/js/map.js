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
const coordinates = [
  [2.33, 48.87],
  [50.43, 30.52],
  [52.35, 4.92],
  [38.88,-77],
  [45.42, -75.7],
  [39.91, 116.38],
  [9.93,-84.08]
];
// Google map elements
let map;
let gMarkers = [];
let icon, icon2, icon_s, icon2_s;


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
    url: markerImage[0], // url defined in template (static)
    scaledSize: new google.maps.Size(38, 38), // scale icon size
  };
  icon_s = {
    url: markerImage[1], // url defined in template (static)
    scaledSize: new google.maps.Size(38, 38), // scale icon size
  };
  icon2 = {
    url: markerImage[2], // url defined in template (static)
    scaledSize: new google.maps.Size(38, 38), // scale icon size
  };
  icon2_s = {
    url: markerImage[3], // url defined in template (static)
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
          //alert("Geocode could not find any results for '" + nextLoc + "'");
          mIndex++;
          if ( memories[mIndex] ) {
            nextLoc = memories[mIndex].loc;
            locate = getLocation( nextLoc );
          } else {
            randomLoc();
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
    randomLoc();
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

  // pan map's center, dont use this, gets twitchy with panMap()
  //centerOffset(500);
  addMarkers(map);
  updateInfoPanel( mIndex );
  validateMarkers();
}


// create markers for all memories
function addMarkers( resultsMap ) {
  for (let i = 0; i < memories.length; i++) {
    makeMarker( i );
  }
}

// try creating marker again after 1s, loops if status stays "OVER_QUERY_LIMIT"
function makeMarker( i ) {
  setTimeout(() => {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': memories[i].loc}, function(results, status) {
      if ( status == 'OK' ) {

        // create marker
        let marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          icon: icon,
          animation: google.maps.Animation.DROP
        });

        // change marker if memory is due
        if ( memories[i].due == "True" ){
          marker.setIcon( icon2 );
        }

        // push marker into the array
        gMarkers[i] = marker;

        marker.addListener('click', function() {
          for (let i = 0; i < memories.length; i++) {
            if (gMarkers[i] === marker){
              // locate = marker.getPosition();
              // map.panTo( locate );
              if ( memories[i].due == "True" ){
                gMarkers[i].setIcon( icon2_s );
              } else {
                gMarkers[i].setIcon( icon_s );
              }
              //gMarkers[i].setAnimation(google.maps.Animation.BOUNCE);
              updateInfoPanel(i);

              currentLoc = null;
            } else if ( gMarkers[i] ) {
              if ( memories[i].due == "True" ){
                gMarkers[i].setIcon( icon2 );
              } else {
                gMarkers[i].setIcon( icon );
              }
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
  }, 200);
}

function getLocation( loc ) {
  geocoder.geocode({'address': loc}, function(results, status) {
    if ( status == 'OK' ) {
      locate = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
    } else {
      mIndex++;
      if ( memories[mIndex].loc ) {
        nextLoc = memories[mIndex].loc;
        locate = getLocation( nextLoc );
      } else {
        randomLoc();
      }
    }
  });

  initMap();
  return locate;
}

function validateMarkers() {
  // markers are being validated after 2s
  setTimeout(() => {
    if ( gMarkers.includes(undefined) || gMarkers.length < memories.length) {
      // could not create one of the markers
      //alert("Couldn't map all memory locations, check your memory values!");
      locError.show(200);
    }
  }, 2000);
}

function randomLoc() {
  index = Math.floor((Math.random() * coordinates.length));
  locate = { lat : coordinates[index][0], lng : coordinates[index][1] };
  if ( map ){
    map.setCenter( locate );
  }
}

// pan the map to a new location
function panMap() {
  for (let i = 0; i < memories.length; i++) {
    if ( memories[i].loc == nextLoc && gMarkers[i] ) {
      map.panTo( gMarkers[i].getPosition() );

      if ( memories[i].due == "True" ){
        gMarkers[i].setIcon( icon2_s );
      } else {
        gMarkers[i].setIcon( icon_s );
      }

    } else if ( gMarkers[i] ) {
      if ( memories[i].due == "True" ){
        gMarkers[i].setIcon( icon2 );
      } else {
        gMarkers[i].setIcon( icon );
      }
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
  infoSpan.html( memories[index].info );
  placeSpan.html( memories[index].loc );
  placeSpan2.html( memories[index].loc );
  dateSpan.html( memories[index].date );
  dateSpan2.html( memories[index].date );

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
  location.href = "/" + memories[mIndex].id + "/edit";
}
