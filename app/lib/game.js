var TetrisGame = require('../shared/gamerules/tetris_game');

module.exports = function(app) {

  app.game = new TetrisGame({
    client: false
  });

};