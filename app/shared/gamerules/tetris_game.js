var radio = require('radio');

var utils = require('./utils');
var Player = require('./player');

function Tetris() {
  this.players = [new Player({
    name: 'Test player',
    game: this
  })];
  this.running = false;
  this.speed = 500;
  this.game_over = true;
}

module.exports = Tetris;

Tetris.prototype = {
  start: function(player) {
    if (this.game_over) this.clear();
    this.game_over = false;
    this.running = true;
    radio('game.start').broadcast();
    this.tick();
  },
  clear: function() {
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
      if (this.speed > 100) this.speed--;
      radio('game.tick').broadcast();
      setTimeout(function() {
        self.tick();
      }, this.speed);
    }
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