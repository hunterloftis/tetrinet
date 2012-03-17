var WebSocketServer = require('ws').Server;

module.exports = function(app) {

  console.log("Starting WebSocket server on port", app.config.port);
  var wss = new WebSocketServer({ port: app.config.port });

  wss.on('connection', function(ws) {
    console.log("Got connection");
    ws.on('message', function(data, flags) {
      console.log("Received from client:", data);
      ws.send("Response from the server.");
    });
  });

  wss.on('close', function() {
    console.log("WS Close");
  });

  wss.on('error', function(e) {
    console.log("WS Error:", e);
  });

};