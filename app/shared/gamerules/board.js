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
    this.rows = utils.multi_array([this.height, this.width], ' ');
  },
  apply_block: function() {
    if (this.block) {
      utils.overlay_array(this.rows, this.block.get_rows(), this.block.y, this.block.x, ' ');
      this.block = undefined;
    }
  },
  check_rows: function() {
    var y = this.rows.length;
    var filled;
    var unfilled = [];
    while(y--) {
      filled = 0;
      for (var x = 0; x < this.rows[y].length; x++) {
        if (this.rows[y][x] !== ' ') filled++;
      }
      if (filled === this.rows[y].length) {
        
      }
      else {
        unfilled.unshift(this.rows[y]);
      }
    }
    while(unfilled.length < this.rows.length) {
      var new_row = utils.multi_array([this.width], ' ');
      unfilled.unshift(new_row);
    }
    this.rows = unfilled;
  },
  is_dead: function() {
    // Check if we've reached the top
  }
};