var TetrisGame = require('./tetris_game');

module.exports = TetrisClient;

function TetrisClient() {
  this.game = new TetrisGame();
}

TetrisClient.prototype = {
  connect: function(uri) {
    console.log("Opening websocket connection...");
    var ws = this.ws = new WebSocket(uri);
    ws.onopen = function() {
      console.log("Connection established.");
      ws.send(JSON.stringify({
        type: 'join',
        name: 'Hunter'
      }));
    };
    ws.onmessage = function(event) {
      console.log("Message from server:", event.data);
    };
    ws.onerror = function() {
      console.log("WS error");
    };
    ws.onclose = function() {
      console.log("WS close");
    };
  }
};