// admin
exports.admin = function(req, res) {
    res.render('admin');
}

exports.start = function(io) {
  return function(req, res) {
    var name = req.body.name;
    var track = req.body.track;   
	
    var util = require('util'),
      twitter = require('twitter');
    var twit = new twitter({
      consumer_key: 'VGHbScXw4WuVrImo5tKlKA',
      consumer_secret: '7ro7NtOIsnuGcLajIFQnDkjb8jnrYftDjt6mRjPnMc',
      access_token_key: '250191200-mUPbBVe2l4x81hlUrEIIMgKQpOHXsodwXVsCxdap',
      access_token_secret: '9gZ9DJVHaKRsolpTYvG162KbDU5j1gSz6RA1jawwAblOz'
    }); 
   
    twit.stream('statuses/filter', {'track': track}, function(stream) {
      stream.on('data', function(data) {
        io.sockets.emit('queue', data);
      });
    });
  };
};

exports.kill = function() {
  return function(req, res) {
    var name = req.body.name;
    var track = req.body.track;
  };
};

exports.init = function() {
  return function(req, res) {
    var name = req.body.name;
    var track = req.body.track;
/*
    var collection = db.get('configs');

    collection.insert({
      "name": name,
      "track": track,
      "running": false
    }, function (err, doc) {
      if (err) {
        res.send("Error occurred adding config to db");
      }
      else {
        res.send(200);
      }
    });
 */ };
};


