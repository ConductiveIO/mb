window.onload = function() {
  var socket = io.connect(window.location.hostname + '/socket.io');
  var tweets = document.getElementById("tweets");
  
  socket.on('outbound', function(html) {
    console.log(html);
    $('#tweets').prepend($(html));
  });
}