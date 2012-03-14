var TetrisGame = require('./tetris_game');

var game = new TetrisGame();

game.start();
game.players[0].add_block(0, 1, 7);
game.test_render();
game.players[0].drop_block();
game.test_render();
game.players[0].shift_right();
game.test_render();
game.players[0].shift_right();
game.test_render();
game.players[0].shift_right();
game.test_render();
game.players[0].rotate_left();
game.test_render();
