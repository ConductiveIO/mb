window.onload = function() {
  var socket = io.connect('127.0.0.1');
  var tweets = document.getElementById("tweets");
  
  socket.on('outbound', function(html) {
    console.log(html);
    $('#tweets').prepend($(html));
  });
}