var radio = require('radio');

var utils = require('./utils');
var Player = require('./player');

function Tetris() {
  this.players = [new Player({
    name: 'Test player',
    game: this
  })];
  this.running = false;
  this.speed = 1000;
}

module.exports = Tetris;

Tetris.prototype = {
  start: function(player) {
    console.log("game started");
    this.running = true;
    radio('game.started').broadcast();
    this.tick();
  },
  stop: function(player) {
    this.running = false;
    radio('game.stopped').broadcast();
  },
  tick: function() {
    if (this.running) {
      console.log("tick");
      var self = this;
      var i = this.players.length;
      var player;
      while (i--) {
        player = this.players[i];
        player.shift_down();
      }
      if (this.speed > 100) this.speed--;
      radio('game.tick').broadcast();
      setTimeout(function() {
        self.tick();
      }, this.speed);
    }
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