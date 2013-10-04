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