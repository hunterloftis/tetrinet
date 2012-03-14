var TetrisGame = require('./tetris_game');
var utils = require('./utils');

var game = new TetrisGame();

game.start();

// Create test right column
for (var y = 0; y < 22; y++) {
  game.players[0].board.rows[y][11] = 'B';
}

// Add our block
console.log("Add block:");
game.players[0].add_block(6, 0, 7);
game.test_render();

// Drop it a level
console.log("Drop it a level:", game.players[0].shift_down());
game.test_render();

// Shift it right a bunch
for (var i = 0; i < 2; i++) {
  console.log("Shift right:", game.players[0].shift_right());
  game.test_render();
}

// Rotate left
console.log("Rotate left:", game.players[0].rotate_left());
game.test_render();

// Shift it left a bunch
for (var i = 0; i < 10; i++) {
  console.log("Shift left:", game.players[0].shift_left());
  game.test_render();
}

// Rotate right
console.log("Rotate right:", game.players[0].rotate_right());
game.test_render();

console.log("Rotate right:", game.players[0].rotate_right());
game.test_render();

console.log("Rotate right:", game.players[0].rotate_right());
game.test_render();

console.log("Rotate right:", game.players[0].rotate_right());
game.test_render();

// Shift left
console.log("Shift left:", game.players[0].shift_left());
game.test_render();

// Add a tile to prevent rotation
game.players[0].board.rows[1][2] = 'B';
game.test_render();

// Rotate left
console.log("Rotate left:", game.players[0].rotate_left());
game.test_render();

// Clear fake block
game.players[0].board.rows[1][2] = ' ';
game.test_render();

// Rotate left
console.log("Rotate left:", game.players[0].rotate_left());
game.test_render();

// Drop it all the way to the bottom
for (var i = 0; i < 21; i++) {
  console.log("Drop:", game.players[0].shift_down());
  game.test_render();
}

// Check to see if the block was applied to the grid
console.log("Final board:");
console.log("Block:", game.players[0].board.block);
utils.render_array(game.players[0].board.rows);