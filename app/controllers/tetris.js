// Our Model
var TetrisGame = require('../shared/gamerules/tetris_game');

module.exports = function(app) {

  var game = new TetrisGame();

  return {
    connection: function(ws) {
      // Add new Player to TetrisGame
      console.log("Tetris Controller: Connection");
    },
    join: function(id, params) {
      console.log("Tetris Controller: JOIN with params:", id, params);
      game.add_player({
        name: params.name
      });
    },
    close: function() {
      // Remove Player from TetrisGame
      console.log("Tetris Controller: Close");
    }
  };
};