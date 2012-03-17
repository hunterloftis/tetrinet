// Our Model
var TetrisGame = require('../shared/gamerules/tetris_game');

module.exports = function(app) {

  var game = new TetrisGame();

  return {
    connection: function(ws) {
      // Add new Player to TetrisGame
      console.log("Tetris Controller: Connection");
    },
    join: function(id, params, send, broadcast) {
      console.log("Tetris Controller: JOIN with params:", id, params);
      game.add_player({
        id: id,
        name: params.name
      });

      broadcast({
        type: 'newplayer',
        id: id,
        name: params.name
      });
      
      return send(undefined, {
        type: 'setid',
        id: id
      });
    },
    close: function() {
      // Remove Player from TetrisGame
      console.log("Tetris Controller: Close");
    }
  };
};