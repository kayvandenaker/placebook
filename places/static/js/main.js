let container_dark = document.getElementById('dark-container');
let this_butt = null;
// store loading image, detach immediately
let map = $(".map");

window.onclick = function(event) {
    if (event.target == container_dark) {
        disable_input();
        location.href="/";
    }
}

// will make page seem to load faster
function disable_input() {
  container_dark.style.display = "none";
}

$(document).ready(function(){

  $('.info-button').on('click', function() {
    $('.infodiv').toggle();
    return false;
  });

  $('.close-button').on('click', function() {
    $('.infodiv').hide();
    return false;
  });

  $('#back').on('click', function() {
    disable_input();
  });

  $(document).on('click', '.mapbutton', function() {
    let new_butt = $(this);

    if (new_butt.is(this_butt)) {

      // hide map when same button is pressed time
      if (map.is(":visible") ) {
        map.hide();
        new_butt.val("Show Map");
      } else {
        map.show();
        new_butt.val("Hide Map");
      }
    } else {


      if (this_butt) {
        // change value of previously pressed button if it exists
        this_butt.val("Show Map");
      }
      this_butt = $(this);

      let val1 = $(this).closest('.card').find('#location').text().split(' ').join('+');
      let str = "https://maps.googleapis.com/maps/api/staticmap?center="+ val1 + "&zoom=12&scale=2&size=600x300&maptype=terrain&key=AIzaSyCdJieNVjZkVK1snuD_zRrruMd-ktMhZBU&format=jpg&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7C" + val1;

      this_butt.val("Hide Map");
      map.show("slow").attr("src",str);
    }

    return false;
  });
});
