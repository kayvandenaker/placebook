let mapdiv = $("#map");
let val1 = $(".mapbutton").first().closest('.card').find('#location').text().split(' ').join('+');

// JQuery
$(document).ready(function(){
  $(document).on('click', '.mapbutton', function() {
      val1 = $(this).closest('.card').find('#location').text().split(' ').join('+');
      codeAddress();
      // let str = "https://maps.googleapis.com/maps/api/staticmap?center="+ val1 + "&zoom=12&scale=2&size=600x300&maptype=terrain&key=AIzaSyCdJieNVjZkVK1snuD_zRrruMd-ktMhZBU&format=jpg&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7C" + val1;

      // map.attr("src",str);

    return false;
  });

});

function codeAddress() {
   geocoder = new google.maps.Geocoder();
   var address = val1;
   console.log(val1);
   geocoder.geocode( { 'address': address}, function(results, status) {
     if (status == google.maps.GeocoderStatus.OK) {

     // alert("Latitude: "+results[0].geometry.location.lat());
     // alert("Longitude: "+results[0].geometry.location.lng());
     }

     else {
       alert("Geocode was not successful for the following reason: " + status);
     }
     return  initMap(results[0].geometry.location.lat(), results[0].geometry.location.lng())
   });
 }

function initMap(lat, lng) {
  //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDRAAmE5TswTx5EnJdwcuUGUv_kkRqtyUM

  var uluru = {"lat": lat, "lng": lng};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: uluru,
    fullscreenControl: false,
    minZoom: 2,
    maxZoom: 17,

  });
  map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}
