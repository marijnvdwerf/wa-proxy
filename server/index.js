var nosql = require('nosql');
var db = nosql.load('data/db.nosql', 'data/media');

var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(80);

app.get('/', function (req, res) {
    res.send('Hello World');
});

io.sockets.on('connection', function (socket) {
    socket.emit('connected', 'connected');
});
