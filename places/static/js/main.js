$(document).ready(function(){
  $('.info-button').on('click', function() {
    $('.infodiv').toggle();
    return false;
  });

  $('.close-button').on('click', function() {
    $('.infodiv').hide();
    return false;
  });

  $(document).on('click', '.mapbutton', function() {
    var val1 = $(this).siblings('h2').text().split(' ').join('+');
    var str = "https://maps.googleapis.com/maps/api/staticmap?center="+ val1 + "&zoom=12&scale=2&size=600x300&maptype=terrain&key=AIzaSyCdJieNVjZkVK1snuD_zRrruMd-ktMhZBU&format=jpg&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7C" + val1;

    $(".map").toggle(400).attr("src",str); //toggle map instead of seperate hide/show
    return false;
  });
});
