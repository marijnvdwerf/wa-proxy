var nosql = require('nosql');
var db = nosql.load('data/db.nosql', 'data/media');

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.bodyParser());
server.listen(80);

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/conversations', function (req, res) {
    db.all(function (conversation, index) {
        return conversation
    }, function (conversations) {
        conversations.forEach(function (convo, index) {
            convo.id = index + 1;
        });
        res.send(conversations);
    });
});

app.get('/conversations/:identifier', function (req, res) {
    var identifier = req.params.identifier;
    res.send(req.params.identifier);
});

app.post('/conversations/:identifier', function (req, res) {
    var identifier = req.params.identifier;
    var type = req.body.type;
    var message;

    switch (type) {
        case 'text':
        default:
            message = {
                id: req.body.id,
                time: req.body.t,
                from: (req.body.author ? req.body.author : req.body.from),

                body: req.body.message
            }
    }

    console.log('MESSAGE');

    db.update(function (conversation) {
        console.log(conversation);
        if (conversation.identifier === identifier) {
            conversation.messages.push(message);
        }
        return conversation;
    }, function (count) {
        if (count === 0) {
            db.insert({
                identifier: identifier,
                messages: [message]
            });
        }
    });

    res.send('');
});

io.sockets.on('connection', function (socket) {
    socket.emit('connected', 'connected');
});
