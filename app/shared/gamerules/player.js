var _ = require('underscore')._;

var Board = require('./board');

module.exports = Player;

function Player(options) {
  _.extend(this, options);
  this.board = new Board();
}

Player.prototype = {
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
  },
  clockwise: function(user_id) {

  },
  counter_clockwise: function(user_id) {

  },
  left: function(user_id) {

  },
  right: function(user_id) {

  },
  down: function(user_id) {

  },
  drop: function(user_id) {

  }
};