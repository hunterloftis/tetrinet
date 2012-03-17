// Our Model
var TetrisGame = require('../shared/gamerules/tetris_game');

module.exports = function(app) {

  var game = new TetrisGame();

  return {
    connection: function(ws) {
      // Add new Player to TetrisGame
      console.log("Tetris Controller: Connection");
    },
    join: function(id, params, callback) {
      console.log("Tetris Controller: JOIN with params:", id, params);
      game.add_player({
        name: params.name
      });
      return callback(undefined, {
        type: 'joined',
        id: id
      });
    },
    close: function() {
      // Remove Player from TetrisGame
      console.log("Tetris Controller: Close");
    }
  };
};