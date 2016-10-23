var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

http.listen(3000, function(){
  console.log('listening on *:3000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.on("chat message", function(msg) {
    io.emit('chat message', msg);
  });

  socket.on("text written", function(msg) {
    detect_mood(msg, function(score) {
        console.log(">>>");
        console.log(score);
      socket.emit('mood detected', {score: score});
    });
  });
});

function detect_mood(s, f) {
  client.invoke("analyze_sentiment", s, function(error, res, more) {
    if (res == undefined) { console.log(res); debugger; console.log(res); }
    var val = res;
    console.log(val);
    f(val);
  });
}
