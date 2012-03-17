var WebSocketServer = require('ws').Server;

module.exports = function(app) {

  console.log("Starting WebSocket server on port", 4001);
  var wss = new WebSocketServer({ port: 4001 });

  wss.on('connection', function(ws) {
    console.log("Got connection");
    app.game.on_client_connection(ws);

    ws.on('message', function(data, flags) {
      app.game.on_client_message(data);
      console.log("Received from client:", data);
    });
  });

  wss.on('close', function(ws) {
    console.log("WS Close");
    app.game.on_client_close(ws);
  });

  wss.on('error', function(e) {
    console.log("WS Error:", e);
  });

};