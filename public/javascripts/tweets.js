window.onload = function() {
  console.log('hello');
  alert('har');
  var socket = io.connect();
  var tweets = document.getElementById("tweets");
  
  socket.on('queue', function (data) {
    console.log('I guess it isn"t getting data??!?');
    if(data) { 
      console.log(data);
      var tweet = $('<div id="tweet" class="twelve columns text-center">' +
                      '<div class="valign row">' +
                        '<div class="two columns text-center">' +
                          '<image class="profile_pic" src=' + data['user']['profile_image_url'] + '>' +
                          '<p>@' + data.user.screen_name + '</p>' +
                        '</div>' +
                        '<div class="ten columns text-center">' +
                          '<div class="row">' +
                            '<div class="twelve columns text-left">' +
                            '<p><strong>' + data['user']['name'] + '</strong></p>' +
                            '</div>' +
                          '<div class="row">' +
                            '<div class="twelve columns text-left">' +
			                        '<p>' + data['text'] + '</p>' +
                            '</div>' +
                          '</div>' +
                          '<div class="row">' +
                            '<div id="media" class="twelve columns text-left">' +
                              '<input type="button" id="accept" value="accept">' +
                              '<input type="button" id="reject" value="reject">' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
            		      '</div>' +
                    '</div>').append('<hr>');  
      if(data['entities']['media']) {
        tweet.find('#media').append('<img class="media_image" src='+data['entities']['media'][0]['media_url']+'>');
      }
        tweet.find('#accept').on('click', function() {
        tweet.find('#accept').remove();
        tweet.find('#reject').remove();
        socket.emit('approved', tweet.html()); 
        tweet.hide();
      });
      tweet.find('#reject').on('click', function() { 
        tweet.hide();
      }); 
      $('#tweets').append(tweet);
    }
  });
};
