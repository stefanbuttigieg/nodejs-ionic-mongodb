/**
 * Created by csvan on 11/04/15.
 */

var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    switch (parsedUrl.pathname) {
        case '/':
            // Read the file into memory and push it to the client
            fs.readFile('index.html', function (err, content) {
                if (err) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(content, 'utf-8');
                }
            });
            break;
    }
});

// Connect the websocket handler to our server
var websocket = require('socket.io')(server);

// Create a handler for incoming websocket connections
websocket.on('connection', function (socket) {
    console.log("New user connected");

    // Bind event handler for incoming messages
    socket.on('new chat message', function(chatData) {
        console.log('Received new chat message');

        // By using the 'broadcast' connector, we will
        // send the message to everyone except the sender.
        socket.broadcast.emit('new chat message', chatData);
    });
});

server.listen(8080);
