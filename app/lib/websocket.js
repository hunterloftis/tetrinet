var WebSocketServer = require('ws').Server;
var uuid = require('node-uuid');

module.exports = function(app) {

  console.log("Starting WebSocket server on port", 4001);
  var wss = new WebSocketServer({ port: 4001 });

  var connections = [];

  function broadcast(message) {
    var msg = JSON.stringify(message);
    connections.forEach(function(ws) {
      ws.send(msg);
    });
  }

  wss.on('connection', function(ws) {
    var id = ws.id = uuid.v4();

    connections.push(ws);
    app.controllers.tetris.connection(id);

    ws.on('message', function(data, flags) {
      var message = JSON.parse(data);
      app.controllers.tetris[message.type](id, message, function(err, response, broadcast) {
        if (response) {
          console.log("Responding with:", response);
          ws.send(JSON.stringify(response));
        }
        if (broadcast) {
          broadcast(message);
        }
      });
    });

    ws.on('close', function() {
      app.controllers.tetris.close(id);
    });

  });

  wss.on('error', function(e) {
    console.log("WS Error:", e);
  });

};