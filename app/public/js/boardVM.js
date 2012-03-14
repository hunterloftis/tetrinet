
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
    this.color_code = available_colors[Math.floor(Math.random() * available_colors.length)];
  }

};




/**
 * entire playing board grid
 */ 
function Board(options) {

  options = options || {};

  var multi_array = require('./utils').multi_array;

  this.width = ko.observable(options.width || 12);
  this.height = ko.observable(options.height || 22);
  this.rows = ko.observableArray(multi_array([this.height(), this.width()], function() {
    return new Block();
  }));

}

Board.prototype = {

};
