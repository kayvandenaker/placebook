let container_dark = document.getElementById('dark-container');

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

//Jquery
$(document).ready(function(){

  // info button clicks
  $('.info-button').on('click', function() {
    $('.infodiv').toggle();
    return false;
  });

  $('.close-button').on('click', function() {
    $('.infodiv').hide();
    return false;
  });


  // User navbar clicks
  $(document).on('click', '#usermenu', function() {
    $('.logged-in').toggle();
  });

});
