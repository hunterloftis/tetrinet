var utils = require('./utils');
var Block = require('./block');

module.exports = Board;

function Board() {
  this.rows = [];
  this.block = undefined;
  this.width = 12;
  this.height = 22;
  this.empty();
}

Board.prototype = {
  empty: function() {
    this.rows = utils.multi_array([this.height, this.width], '.');
  },
  is_dead: function() {
    // Check if we've reached the top
  }
};