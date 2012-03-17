var WebSocketServer = require('ws').Server;

module.exports = function(app) {

  console.log("Starting WebSocket server...");
  var wss = new WebSocketServer({ server: app });

  wss.on('connection', function(ws) {
    console.log("Got connection");
    ws.on('message', function(data, flags) {
      console.log("Received from client:", data);
    });
  });

};