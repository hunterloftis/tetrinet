module.exports = function(app) {
  return {
    
    // Landing
    
    index: [
      function(req, res, next) {
        res.render('home/index');
      }],


    // test for board
    board: [
      function(req, res, next) {
        res.render('home/board');
      }]

  };
};
