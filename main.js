var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PythonShell = require('python-shell');
// var pyshell = new PythonShell('main.py', {mode: "text"});

var zerorpc = require("zerorpc");

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

/*
app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});
*/

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
      socket.emit('mood detected', {score: score});
    });
  });
});

function detect_mood(s, f) {
  // sends a message to the Python script via stdin
  
  console.log(">>>>");
  console.log(s);
  client.invoke("analyze_sentiment", s, function(error, res, more) {
  console.log("!!!!>>>>");
  console.log(s);
  console.log(error);
  console.log(res);
  console.log(more);
    if (res == undefined) { console.log(res); debugger; console.log(res); }
    var val = res.toString("utf8")/1;
    console.log(val);
    f(val);
  });
  //pyshell.send(s);

    /*
  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    debugger;
    console.log(message);
    f(message/1.0);
      
    pyshell.on("message", function() {});
  });
  */
}

console.log("try");
detect_mood("zoo", function(s) { console.log(s); });
console.log("end");

/*
// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) throw err;
  console.log('finished');
});
*/


/*
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});
*/


/*
var spawn = require('child_process').spawn,
    py    = spawn('python',['test.py']);

py.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});

py.stdin.write(JSON.stringify({"foo": "bar"}));
*/




