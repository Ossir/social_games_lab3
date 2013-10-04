var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, function() {
   console.log('Listening on ' + port);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
   response.sendfile(__dirname + '/index.html');
});

var io = require('socket.io').listen(server);

io.configure(function () {
   io.set("transports", ["xhr-polling"]);
   io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
   socket.emit('news', { hello: 'world' });
   socket.on('my other event', function (data) {
      console.log(data);
   });
});