var radio = require('radio');
var _ = require('underscore')._;

var utils = require('./utils');
var Player = require('./player');

function Tetris(options) {
  _(this).extend(options);

  this.players = [];
  this.reset();

  if (this.client) {
    this.connect();
  }
  else {
    this.listen();
  }
}

module.exports = Tetris;

Tetris.prototype = {

  connect: function() {
    console.log("Opening websocket connection...");
    var ws = this.ws = new WebSocket('ws://localhost:4001');
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
  },
  listen: function() {

  },

  // Both
  add_player: function(player_data) {
    var new_player = new Player({
      name: player_data.name,
      game: this
    });
    this.players.push(new_player);
  },
  reset: function() {
    this.running = false;
    this.speed = 300;
    this.speed_interval = 10000;
    this.speed_multiplier = 0.997;
    this.next_speed = 0;
    this.min_speed = 100;
    this.game_over = true;
    this.clear_players();
  },
  start: function(player) {
    if (this.client) {
      this.ws.send('game.start');
      return;
    }
    if (this.game_over) this.reset();
    this.game_over = false;
    this.running = true;
    this.slow_down();
    radio('game.start').broadcast();
    this.tick();
  },
  clear_players: function() {
    var i = this.players.length;
    while (i--) {
      this.players[i].clear();
    }
  },
  stop: function(player) {
    this.running = false;
    radio('game.stop').broadcast();
  },
  toggle: function(player) {
    if (this.running) this.stop();
    else this.start();
  },
  tick: function() {
    if (this.running) {
      var self = this;
      this.tick_players();
      if (this.players_in_game() === 0) {
        this.game_over = true;
        this.stop();
      }
      var now = new Date().getTime();
      if (now > this.next_speed && this.speed > this.min_speed) {
        this.slow_down();
      }
      radio('game.tick').broadcast();
      setTimeout(function() {
        self.tick();
      }, this.speed);
    }
  },
  slow_down: function() {
    this.speed *= this.speed_multiplier;
    this.next_speed = new Date().getTime() + this.speed_interval;
    radio('game.speed').broadcast();
  },
  tick_players: function() {
    var i = this.players.length;
    while (i--) {
      this.players[i].tick();
    }
  },
  players_in_game: function() {
    var i = this.players.length;
    var in_game = 0;
    while (i--) {
      if (!this.players[i].game_over) in_game++;
    }
    return in_game;
  },
  test_render: function() {
    var grid = utils.clone_array(this.players[0].board.rows);
    var block = this.players[0].board.block;
    if (block) {
      utils.overlay_array(grid, block.get_rows(), block.y, block.x);
    }
    utils.render_array(grid);
    console.log('');
  }
};