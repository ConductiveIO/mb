window.onload = function() {
 
  var socket = io.connect(window.location.hostname + '/socket.io');
  alert(window.location.hostname);
  
  var button = $('<button/>', {
        text: 'insert ad', //set text 1 to 10
        id: 'ad',
        click: function( event ) {
				event.preventDefault();
        socket.emit('approved', "<img src='FakeAd.png'>");
			}
    });
   
  $('#leaderboard').append(button);
};