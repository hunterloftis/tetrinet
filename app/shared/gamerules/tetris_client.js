var TetrisGame = require('./tetris_game');

module.exports = TetrisClient;

function TetrisClient() {
  this.name = 'Hunter';
  this.id = undefined;
  this.game = new TetrisGame();
}

TetrisClient.prototype = {
  connect: function(uri) {
    var self = this;
    console.log("Opening websocket connection...");
    var ws = this.ws = new WebSocket(uri);
    ws.onopen = function() {
      console.log("Connection established.");
      self.join();
    };
    ws.onmessage = function(event) {
      console.log("Message from server:", event.data);
      var message = JSON.parse(event.data);
      self[message.type](message);
    };
    ws.onerror = function() {
      console.log("WS error");
    };
    ws.onclose = function() {
      console.log("WS close");
    };
  },
  join: function() {
    this.ws.send(JSON.stringify({
      type: 'join',
      name: this.name
    }));
  },
  setid: function(params) {
    this.id = params.id;
    console.log("My player ID is", this.id);
  },
  newplayer: function(params) {
    console.log("New player joined game with ID:", params.id);
  }
};