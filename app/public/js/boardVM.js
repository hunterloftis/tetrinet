/**
 * individual blocks in grid
 */ 
function Block(options) {

  options = options || {};

  this.on = ko.observable(false);
  this.color_code = ko.observable(null);

}

Block.prototype = {

  show: function() {
    this.on(true);
  }

};




/**
 * entire playing board grid
 */ 
function Board(options) {

  options = options || {};

  this.width = ko.observable(options.width || 12);
  this.height = ko.observable(options.height || 22);
  this.rows = ko.observableArray(multi_array([this.height(), this.width()], function() {
    return new Block();
  }));

}

Board.prototype = {

};
