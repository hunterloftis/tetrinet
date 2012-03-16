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
}

module.exports = Tetris;

Tetris.prototype = {
  start: function(player) {
    console.log("game started");
    this.running = true;
    radio('game.start').broadcast();
    this.tick();
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
      var i = this.players.length;
      var player;
      var still_in_game = 0;
      // Loop all players
      while (i--) {
        player = this.players[i];
        player.shift_down();
        if (typeof(player.board.block) === 'undefined') {
          player.add_next(player.board);
        }
        if (!player.game_over) still_in_game++;
      }
      if (still_in_game === 0) {
        this.stop();
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