//var resource = require('express-resource');

module.exports = function(app) {
  
  // Home
  //app.resource(app.controllers.home);

  app.get('/', app.controllers.home.index);

  app.get('/board', app.controllers.home.board);

};