var TetrisGame = require('./tetris_game');

var game = new TetrisGame();

game.start();

// Create test right column
for (var y = 0; y < 22; y++) {
  game.players[0].board.rows[y][11] = 'X';
}

// Add our block
console.log("Add block:");
game.players[0].add_block(6, 0, 7);
game.test_render();

// Drop it a level
console.log("Drop it a level:");
game.players[0].drop_block();
game.test_render();

// Shift it right a bunch
for (var i = 0; i < 2; i++) {
  var shifted = game.players[0].shift(0, 1);
  if (!shifted) console.log("Couldn't shift right:");
  else console.log("Shift right:");
  game.test_render();
}

// Rotate left
console.log("Rotate left:");
game.players[0].rotate_left();
game.test_render();

// Shift it left a bunch
for (var i = 0; i < 10; i++) {
  var shifted = game.players[0].shift(0, -1);
  if (!shifted) console.log("Couldn't shift left:");
  else console.log("Shift left:");
  game.test_render();
}