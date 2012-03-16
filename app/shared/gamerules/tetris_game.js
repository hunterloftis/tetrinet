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
  this.speed_interval = 10000;
  this.speed_delta = -5;
  this.next_speed = 0;
  this.min_speed = 100;
  this.game_over = true;
}

module.exports = Tetris;

Tetris.prototype = {
  start: function(player) {
    if (this.game_over) this.clear();
    this.game_over = false;
    this.running = true;
    this.next_speed = new Date().getTime() + this.speed_interval;
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
      var now = new Date().getTime();
      if (now > this.next_speed && this.speed > this.min_speed) {
        this.speed += this.speed_delta;
        this.next_speed = now + this.speed_interval;
      }
      if (this.speed > 100) this.speed --;
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