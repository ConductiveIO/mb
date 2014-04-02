window.onload = function() {
 
    var socket = io.connect('metterboard-99360.use1-2.nitrousbox.com:3000');
    var tweets = document.getElementById("tweets");
 
    socket.on('queue', function (data) {
      console.log(data);
      //tweets.appendChild('<p> HERRO MUFUCKKKAAA </p>');
      $('#tweets').append('<div><a href="#" onClick="sendApproval()"><p><image src='+ data['user']['profile_image_url'] +'><strong>'+data['user']['name']+'</strong>@'+ data['user']['screen_name']+ '</p><p>'+data['text']+'</p><hr></a></div>');
    });
 /*
    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text });        
    }; 
*/
}