var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.DB_URL, {}, function (err, db) {
    var conversations = db.collection('conversations');
    var drafts = db.collection('drafts');

    var express = require('express');
    var app = express();
    var http = require('http');
    var server = http.createServer(app);
    var io = require('socket.io').listen(server, { log: false });

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
        conversations.find().toArray(function (err, convos) {
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
        console.log(JSON.stringify(req.body));

        var message = req.body;
        message.target = identifier;

        drafts.insert(message, {w: 1}, function (err, result) {
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
                    name: req.body.name,
                    body: req.body.message
                };
        }

        console.log('MESSAGE');

        var query = {
            identifier: identifier
        };

        var upsert = {
            $set: {
                identifier: identifier
            },
            $push: {
                messages: message
            }
        };

        var socketPush = {
            identifier: identifier,
            messages: [
                message
            ]
        };

        if (identifier.indexOf('@g.us') === -1) {
            console.log('no group chat. update username');
            upsert['$set']['subject'] = message.name;
            socketPush.subject = message.name;
        }
        io.sockets.emit('message', socketPush);


        conversations.update(query, upsert, {
            upsert: true,
            w: 1
        }, function (err, result) {
            console.log(['err', err]);
            console.log(['result', result]);
        });

        res.send('');
    });


    app.post('/conversations/:identifier/update', function (req, res) {
        var identifier = req.params.identifier;

        console.log('MESSAGE');

        var query = {
            identifier: identifier
        };

        var upsert = {
            $set: req.body
        };

        console.log('UPSERT');
        console.log(upsert);

        var socketPush = req.body;
        socketPush.identifier = identifier;
        socketPush.messages = [];
        io.sockets.emit('message', socketPush);

        conversations.update(query, upsert, {
            upsert: true,
            w: 1
        }, function (err, result) {
            console.log(['err', err]);
            console.log(['result', result]);
        });

        res.send('');
    });

    io.sockets.on('connection', function (socket) {
        socket.emit('connected', 'connected');
    });

});

