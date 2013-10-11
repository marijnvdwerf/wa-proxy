var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.DB_URL, {}, function (err, db) {
    var conversations = db.collection('conversations');
    var drafts = db.collection('drafts');

    var express = require('express');
    var app = express();
    var http = require('http');
    var server = http.createServer(app);
    var io = require('socket.io').listen(server);

    app.use(express.bodyParser());
    server.listen(80);

    app.all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    app.get('/', function (req, res) {
        res.send('Hello World');
        io.sockets.emit('message', {
            name: 'World',
            message: 'Hello'
        });
    });

    app.get('/conversations', function (req, res) {
        conversations.find().toArray(function(err, convos) {
            res.send(convos);
        });
//        conversations.insert({hello: 'world_no_safe'}, {w: 1}, function (err, result) {
//            console.log(err);
//            console.log(result);
//        });
    });

    app.get('/conversations/:identifier', function (req, res) {
        var identifier = req.params.identifier;
        res.send(req.params.identifier);
    });

    app.post('/conversations/:identifier', function (req, res) {
        var identifier = req.params.identifier;
        res.send(req.params.identifier);

        console.log('identifier: ' + identifier);

        drafts.insert({
            target: identifier,
            message: req.body.message
        }, {w: 1}, function (err, result) {
            console.log('result');
            console.log(err);
            console.log(result);
        });
    });

    app.post('/conversations/:identifier/secret', function (req, res) {
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
                };

                io.sockets.emit('message', {
                    conversationIdentifier: identifier,
                    message: message
                });
        }

        console.log('MESSAGE');
        
        conversations.update({
           identifier: identifier
        }, {
           $set: {
              identifier: identifier
           },
           $push: {
              messages: message
           }
        }, {
           upsert:true,
           w: 1
        }, function(err, result) {
           console.log(result);
           console.log(err);
        });

        res.send('');

//        db.update(function (conversation) {
//            console.log(conversation);
//            if (conversation.identifier === identifier) {
//                conversation.messages.push(message);
//            }
//            return conversation;
//        }, function (count) {
//            if (count === 0) {
//                db.insert({
//                    identifier: identifier,
//                    messages: [message]
//                });
//            }
//        });
//
//        res.send('');
    });

    io.sockets.on('connection', function (socket) {
        socket.emit('connected', 'connected');
    });

});

