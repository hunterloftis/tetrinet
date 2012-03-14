var available_colors = ['red', 'green', 'blue', 'purple', 'orange', 'black'];


/**
 * individual blocks in grid
 */ 
function Block(options) {

  options = options || {};

  this.on = ko.observable(false);
  this.color = ko.observable(available_colors[Math.floor(Math.random() * available_colors.length)]);

}

Block.prototype = {

  show: function() {
    this.on(true);
  },

  random_color: function() {
    this.color(available_colors[Math.floor(Math.random() * available_colors.length)]);
  }

};




/**
 * entire playing board grid
 */ 
function Board(options) {

  options = options || {};

  var multi_array = require('./utils').multi_array;

  this.player = ko.observable(options.player);
  this.width = ko.observable(options.width || 12);
  this.height = ko.observable(options.height || 22);
  this.rows = ko.observableArray(multi_array([this.height(), this.width()], function() {
    return new Block();
  }));

}

Board.prototype = {
  clear_board: function() {
    for(var r = 0; r < this.width(); r++) {
      for(var c = 0; c < this.height(); c++) {
        this.rows()[c][r].on(false); 
      }
    }
  },
  start: function() {
    this.clear_board();
    this.player().add_block(6,0,7);
    this.render(this.player().board.block);
  }, 
  drop: function() {
    this.clear_board();
    this.player().drop_block();
    this.render(this.player().board.block);
  },
  left: function() {

  },
  right: function() {

  },
  render: function(block) {
    this.rows()[block.y][block.x].on(true);
  }
};
