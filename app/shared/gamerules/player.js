var _ = require('underscore')._;

var Board = require('./board');
var Block = require('./block');

module.exports = Player;

function Player(options) {
  _.extend(this, options);
  this.board = new Board();
}

Player.prototype = {
  add_block: function(type, row, column) {
    if (this.board.block) {
      throw new Error("A block already exists on this board");
    }
    var new_block = new Block(type, {
      y: row,
      x: column
    });
    this.board.block = new_block;
  },
  shift_down: function() {
    if (this.shift(1,0)) {
      return true;
    }
    else {
      this.board.apply_block();
      return false;
    }
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