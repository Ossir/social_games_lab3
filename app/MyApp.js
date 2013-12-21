var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;
var mongo = require('mongoskin');
var db = mongo.db('mongodb://user1:123123123@alex.mongohq.com:10088/social');
if (db)
    console.log ('connected')
else
    console.log('not connected')
    
db.collection('users').ensureIndex([['name', 1]], true, function(err, replies){});

db.bind('users');

server.listen(port, function() {
   console.log('Listening on ' + port);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
   response.sendfile(__dirname + '/index.html');
   var ip = request.connection.remoteAddress;
   var user = {ip_address: ip, created_at: new Date()};
//   db.user.findOne({ip: user.ip}, function(err, updated_user)
   db.users.findOne({ip_address: user.ip_address}, function(err, user_found){
        if(err) {
             return console.log('findOne error:', err);
        }
        else
        {
            if (user_found == null)
            {
                db.users.insert(user, function(err){
                   if(err) {
                       return console.log('inser error', err);
                   }
                   console.log('inserted, user: ', user);
               });
            }
            else
            {
                db.users.update({ip_address: user.ip_address}, {$set: {updated_at: new Date()}}, function(err) {
                   if(err) {
                        return console.log('update error', err);
                   }
                   console.log('updated, user: ', user);
               });
            }
        }
   });
    
//   db.users.insert({name: "username"})
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