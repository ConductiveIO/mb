
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.start = function(db) {
  return function(req, res) {
    var request = require('request');
    request.post('/php/stream.php', {name: req.body.name, track: req.body.track},
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("Stream started successfully");
          res.send(200);
        } else {
          console.log("Stream failed to start: " + body);
          res.send(body);
        };
    });
 
    var name = req.body.name;
    var track = req.body.track;

    var collection = db.get('configs');

    collection.update({"name":name, "track":track}, {$set: {running: true}}, function(err, db) {
      if (err) {
        res.send('could not set config running=true: ' + err);
      } else {
        res.send(200);
      };
    });
    
    db.collectionNames(function(err, items) {
      if (err) {
        res.send(500);
      } else if (items.indexOf("queue") != -1) {
        collection = db.get('queue');
      } else {
        collection = db.createCollection('queue', {capped: true, size: 1024}, function(err, r) {
            if(err != null) {
              res.send(500);
            } else {
              res.send(200);
              console.log("created queue");
            }
          }
        );
      }
    });
    
    twit.stream('filter', {'track': track}, function(stream) {
      stream.on('data', function(data) {
        collection.insert(data, function (err, doc) {
          if (err) {
            res.send("Error occurred adding data to queue");
          } else {
            res.send(200);
          }
        });
      });
    });

    collection.find({}, {}, function(e, docs) {
      res.send('admin', {
        "queue": docs
      });
    });
  };
};

exports.kill = function(db) {
  return function(req, res) {
    var name = req.body.name;
    var track = req.body.track;

    var collection = db.get('configs');

    collection.update({
      "name": name,
      "track": track,
    }, 
    { 
      $set: {
        "running": true,
      },
    },
    function (err, doc) {
      if (err) {
        res.send("Error occurred stopping stream");
      }
      else {
        res.send(200);
      }
    });
  };
};

exports.init = function(db) {
  return function(req, res) {
    var name = req.body.name;
    var track = req.body.track;

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
  };
};

exports.admin = function() {
  return function(req, res) {
    res.render('admin');
  }
};

