// var express = require('express')
// var http = require('http');
// var app = express();
// var server = http.createServer(app);
// var port = process.env.PORT || 3000;
// var mongo = require('mongoskin');
// var VK = require('vkapi');

// var vk = new VK({
//     'appID' : 4071906,
//     'appSecret' : '94EBfNeHFrCQ28GuQNWj',
//     'mode' : 'sig'
// });

// var username = ""

// vk.setToken();
// vk.on('appServerTokenReady', function() {
//     vk.request('getProfiles', {'uids' : '8857627'});
//     // и так далее...
//     vk.on('done:getProfiles', function(_o) {
//         console.log(_o);
//         username = _o['response'][0]['first_name'];
//     });
// });

// var db = mongo.db('mongodb://user1:123123123@alex.mongohq.com:10088/social');
// if (db)
//     console.log ('connected')
// else
//     console.log('not connected')
    
// db.collection('users').ensureIndex([['name', 1]], true, function(err, replies){});

// db.bind('users');

// server.listen(port, function() {
//   console.log('Listening on ' + port);
// });

// app.use(express.static(__dirname + '/public'));

// app.get('/', function (request, response) {
//   response.sendfile(__dirname + '/index.html');
//   var ip = request.connection.remoteAddress;
//   var user = {ip_address: ip, created_at: new Date()};
// // db.user.findOne({ip: user.ip}, function(err, updated_user)
//   db.users.findOne({ip_address: user.ip_address}, function(err, user_found){
//         if(err) {
//              return console.log('findOne error:', err);
//         }
//         else
//         {
//             if (user_found == null)
//             {
//                 db.users.insert(user, function(err){
//                   if(err) {
//                       return console.log('inser error', err);
//                   }
//                   console.log('inserted, user: ', user);
//               });
//             }
//             else
//             {
//                 db.users.update({ip_address: user.ip_address}, {$set: {updated_at: new Date()}}, function(err) {
//                   if(err) {
//                         return console.log('update error', err);
//                   }
//                   console.log('updated, user: ', user);
//               });
//             }
//         }
//   });
    
// // db.users.insert({name: "username"})
// });

// var io = require('socket.io').listen(server);

// io.configure(function () {
//   io.set("transports", ["xhr-polling"]);
// //   io.set("polling duration", 10);
// });

// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: username });
//   socket.on('my other event', function (data) {
//       console.log(data);
//   });
// });
var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 3000;

var ip;
var id;

server.listen(port, function() {
   console.log('Listening on ' + port);
});


app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(server);

io.configure(function () {
   io.set("transports", ["xhr-polling"]);
   io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {

   socket.on('vkID', function(data) {

 id = data.id;

  });
  
   socket.on('score', function (score) {
       if (id != null){
         var user = {vkid: id ,  ipAddress: ip, dateConnection: new Date(), clickScore:score.clicked};
         
    conn.collection('users').findOne(
    {
      vkid:user.vkid
    },
    function(err, doc)
    {
    if (err) { }
    if (doc) //если пользователь есть, то обновляем
     {  
         //socket.emit('saved', {pos:'update'});
         conn.collection('users').update(
        {
             vkid:user.vkid
        },
        {
    
           $set: {updated_at: new Date(),clickScore: user.clickScore}
            //$set: {: new Date()}
        },
        {
            
         upsert:true
        });
     }
     else //если нет, то создаем
     {
         /// socket.emit('saved', {pos:'saved'});
         conn.collection('users').insert(user, {safe: true}, function(err, records){
       ////console.log("Record added  ");

         });
     }
});
       
       }   
   });
   
});

var mongo = require('mongoskin');
var conn = mongo.db('mongodb://user1:123123123@alex.mongohq.com:10088/social');


app.get('/', function (request, response)
{
   response.sendfile(__dirname + '/index.html');
   
   ip = request.connection.remoteAddress;
  // var user = {ipAddress: ip, dateConnection: new Date()};


   
});

