var _ = require('underscore')._;
var radio = require('radio');

var Board = require('./board');
var Block = require('./block');

module.exports = Player;

function Player(options) {
  this.id = 'someuuid';
  _.extend(this, options);
  this.board = new Board();
  this.game_over = false;
  this.score = 0;
  this.next_block = Math.floor(Math.random()*7);
}


Player.prototype = {
  start: function() {
    this.game.start(this);
  },
  stop: function() {
    this.game.stop(this);
  },
  toggle: function() {
    this.game.toggle(this);
  },
  tick: function() {
    this.shift_down();
    if (typeof(this.board.block) === 'undefined') {
      this.add_next(this.board);
    }
  },
  clear: function() {
    this.board.empty();
    this.score = 0;
    this.select_next();
    this.game_over = false;
  },
  add_block: function(type, row, column) {
    if (typeof(this.board.block) === 'undefined') {
      var new_block = new Block(type, {
        y: row,
        x: column
      });
      this.board.block = new_block;
      return true;
    }
    return false;
  },
  select_next: function() {
    this.next_block = Math.floor(Math.random()*7);
    radio('player.next_block').broadcast(this);
  },
  add_next: function(board) {
    this.add_block(this.next_block, 0, 5);
    this.select_next();
  },
  shift_down: function() {
    if (this.shift(1,0)) {
      return true;
    }
    else {
      this.board.apply_block();
      var cleared = this.board.check_rows();
      if (cleared > 0) {
        radio('player.line_cleared').broadcast(this);
        this.update_score(cleared * cleared);
      }
      return false;
    }
  },
  update_score: function(delta) {
    this.score += delta;
    radio('player.score_updated').broadcast(this);
  },
  shift: function(dy, dx) {
    if (this.board.block) {
      if (this.board.block.fits(this.board.rows, this.board.block.y + dy, this.board.block.x + dx)) {
        this.board.block.x += dx;
        this.board.block.y += dy;
        return true;
      }
      else return false;
    }
  },
  shift_left: function() {
    return this.shift(0, -1);
  },
  shift_right: function() {
    return this.shift(0, 1);
  },
  rotate_left: function() {
    if (this.board.block) return this.board.block.rotate(this.board.rows, true);
  },
  rotate_right: function() {
    if (this.board.block) return this.board.block.rotate(this.board.rows, false);
  },
  drop: function() {
    if (this.board.block) return this.board.block.drop(this.board.rows);
  },
  create_game: function(user_id) {
    // End any games the user is currently running
    // Does the user have permission to create a game?
  },
  join_game: function(user_id, game_id) {
    // Leave any other games the user_id is in
    // Does user_id have permission to join this game?
    // Does the game have a space available?
  },
  end_game: function(user_id, game_id) {
    // Does the user_id have permissin to end this game?
  },
  use_special: function(user_id, player_id) {
    // Find the next special in the user's queueu
    // Is player_id in the same game?
  }
};