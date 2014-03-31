
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
// require php-express and config
phpExpress = require('php-express')({
  binPath: '/usr/bin/php' // php bin path.
});

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/mb_data_store');
var fs = require('fs');
var url = require('url');

var emitter = require('events').EventEmitter;
var assert = require('assert');
var config = require('./config').config;

var QueryCommand = mongo.QueryCommand;
var Cursor = mongo.Cursor;
var Collection = mongo.Collection;

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
var theport = process.env.PORT || 3000;

var uristring = "mongodb://localhost/mb_data_store";
var mongoUrl = url.parse(uristring);

server.listen(theport);
console.log("http server on port: " + theport);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser()); 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
  res.sendfile(routes.index);
});
app.get('/users', user.list);

app.get('/admin', routes.admin(db));

app.post('/init', routes.init(db));
app.post('/start',routes.start(db));
app.post('/kill', routes.kill(db));

mongo.Db.connect (uristring, function(err, db) {
  console.log( "Attempting connection to " + mongoUrl.protocol + "//" + mongoUrl.hostname + " (complete URL supressed).");
  db.collectionNames(function(err, items) {
    if(items.indexOf('queue') == -1) {
      db.createCollection('queue', {'capped':true, 'size':1024}, 
      function(err) {
        if (err) {
          console.log("Error creating capped collection.");
        } else {
          console.log("app.js: Queue collection created");
        }
      });
    };
  });

  db.collection( "queue", function (err, collection) {
    collection.isCapped(function (err, capped) {
      if (err) {
        console.log ("Error when detecting capped collection. Aborting. Capped collection necessary for tailed cursor.");
        process.exit(1);
      }
      if (!capped) {
        console.log (collection.collectionName + " is not a capped collection. Aborting.");
        process.exit(2);
      }
      console.log("Success connectiong to " + mongoUrl.protocol + "//" + mongoUrl.hostname + ".");
      startIOServer(collection);
    });
  });
});

function startIOServer(collection) {
  console.log("Starting ...");
  io.configure(function () {
    io.set("transports", config[platform].transports);
    io.set("polling duration", 10);
    io.set("log level", 2);
  });
  io.sockets.on("connection", function (socket) {
    readAndSend(socket, collection);
  });
};

function readAndSend (socket, collection) {
  collection.find({}, {"tailable": 1, "sort": [["$natural", 1]]}, function(err, cursor) {
    cursor.intervalEach(300, function(err, item) {
      if(item != null) {
        socket.emit("queue", item);
      }
    });
  });
};

Cursor.prototype.intervalEach = function(interval, callback) {
  var self = this;
  if (!callback) {
    throw new Error("callback is mandatory");
  };
   
  if(this.state != Cursor.CLOSED) {
    setTimeout(function(){
      self.nextObject(function(err, item) {
        if(err != null) return callback(err, null);
      
        if(item != null) {
          callback(null, item);
          self.intervalEach(interval, callback);
        } else {
          self.state = Cursor.CLOSED;
          callback(err, null);
        }

        item = null;
      });
    }, interval);
  } else {
    callback(new Error("Cursor is closed"), null);
  };
};
