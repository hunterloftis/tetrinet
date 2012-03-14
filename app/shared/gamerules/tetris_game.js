var utils = require('./utils');
var Player = require('./player');

module.exports = Tetris;

function Tetris() {
  this.players = [new Player({
    name: 'Test player'
  })];
}

Tetris.prototype = {
  start: function() {
    console.log("Game started");

/*
    this.players[0].board.add_block(3, 1, 10);
    var grid = utils.clone_array(this.players[0].board.rows);
    var block = this.players[0].board.block;
    if (block) {
      utils.overlay_array(grid, block.get_rows(), block.y, block.x);
    }
    utils.render_array(grid);
*/
  }

};