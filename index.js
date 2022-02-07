#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer();
server.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port 8081');
});

const wsServer = new WebSocketServer({
    httpServer: server
});

const clients = {};

function* uuid() {
    let idx = 0;
    while (true) {
        yield idx;
        idx++;
    };
};

const uid = uuid();

const sendMessage = (message) => {
    Object.keys(clients).forEach((client) => {
        clients[client].send(message);
    })
}

wsServer.on('request', function(request) {
    console.log("test")
    var connection = request.accept(null, request.origin);
    clients[uid.next().value] = connection;
    connection.on('message', function(message) {
            console.log('Received Message: ' + message.utf8Data);
            sendMessage(message.utf8Data);
    });

    console.log((new Date()) + ' Connection accepted.');
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

