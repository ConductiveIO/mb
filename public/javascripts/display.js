window.onload = function() {
  var socket = io.connect('metterboard-99360.use1-2.nitrousbox.com:3000');
  var tweets = document.getElementById("tweets");
  
  socket.on('outbound', function(html) {
    console.log(html);
    $('#tweets').prepend($(html));
  });
}