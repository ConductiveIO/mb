
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
// my routes
var queue = require('./routes/queue');
var display = require('./routes/display');
var http = require('http');
var path = require('path');

var fs = require('fs');
var url = require('url');

var emitter = require('events').EventEmitter;
var assert = require('assert');
var config = require('./config').config;


var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
console.log("http server on port: " + app.get('port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser()); 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function (req, res) {
  res.render(index);
});          

var server = http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
  //console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    socket.on('inbound', function (data) {
        io.sockets.emit('queue', data);
    });
});

io.sockets.on('connection', function (socket) {
    socket.on('approved', function (data) {
        io.sockets.emit('outbound', data);
    });
});
                                                                                                                           
app.get('/queue/:track', queue.queue(io));                                                                                                                             
app.get('/display', display.display(io));

