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

//jQuery
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

  // show memory options on card click
  $(document).on('click', '.card', function() {
    let edit = $(this).find('.card-bottom');
      if (edit.is(":hidden")) {
        edit.slideDown( 100 );
      }
    return false;
  });
  // hide options on card leave
  $(document).on('mouseleave', '.card', function() {
    let edit = $(this).find('.card-bottom');
      if (edit.is(":visible")) {
        edit.slideUp( 100 );
      }
    return false;
  });

  // User navbar clicks
  $(document).on('click', '#usermenu', function() {
    $('.logged-in').toggle();
  });

});

// function for deenitize stored javascript symbols ("<", "&", etc.)
var convert = function(convert){
    return $("<span />", { html: convert }).text();
    //return document.createElement("span").innerText;
};
