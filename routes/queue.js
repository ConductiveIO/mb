exports.queue = 
  function(io) {
    return function(req, res) {
      var track = req.params.track;  
      var util = require('util'),
        twitter = require('twitter');
      var twit = new twitter({
        consumer_key: 'VGHbScXw4WuVrImo5tKlKA',
        consumer_secret: '7ro7NtOIsnuGcLajIFQnDkjb8jnrYftDjt6mRjPnMc',
        access_token_key: '250191200-mUPbBVe2l4x81hlUrEIIMgKQpOHXsodwXVsCxdap',
        access_token_secret: '9gZ9DJVHaKRsolpTYvG162KbDU5j1gSz6RA1jawwAblOz'
      }); 
  
     
      twit.stream('statuses/filter', {'track': '#' + track}, function(stream) {
        io.sockets.removeAllListeners('queue');
        stream.on('data', function(data) {
          console.log(data);
          io.sockets.emit('queue', data);
        });
        twit.currentTwitStream = stream;
        window.onunload(function(){currentTwitStream.destroy();});
      });
      
      res.render('queue.jade');
    }
  }
