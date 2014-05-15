window.onload = function() {
 
  var socket = io.connect('metterboard-99360.use1-2.nitrousbox.com:3000');
  
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