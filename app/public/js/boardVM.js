var available_colors = ['red', 'green', 'blue', 'purple', 'orange', 'black', 'yellow'],
    base_speed = 300,
    speed_multi = 2;

var radio = require('radio');
var BlockClass = require('./block');
var block_types = new BlockClass();
block_types = block_types.templates;

/**
 * individual blocks in grid
 */ 
function Block(options) {

  options = options || {};

  this.on = ko.observable(false);
  this.color = ko.observable('black');

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
  var self = this;
  options = options || {};

  var multi_array = require('./utils').multi_array;

  this.started = ko.observable(false);
  this.player = ko.observable(options.player);
  this.score = ko.observable(0);
  this.high_score = ko.observable(localStorage.high_score || 0);
  this.game_over = ko.observable(false);
  this.speed = ko.observable(base_speed);
  this.next_block = ko.observable(null);
  this.width = ko.observable(options.width || 12);
  this.height = ko.observable(options.height || 22);
  this.rows = ko.observableArray(multi_array([this.height(), this.width()], function() {
    return new Block();
  }));

  // Events
  radio('player.update').subscribe([function() {
    this.render();
  }, this]);

  radio('player.score').subscribe([function(score) {
    
    // set score observable
    this.score(this.score()+(score*score));

    // change speed
    this.speed(base_speed - (this.score()*speed_multi));

    // set high score
    if (this.score() > this.high_score()) {
      this.high_score(this.score());
      localStorage.high_score = this.high_score();
    }
  }, this]);

}

Board.prototype = {
  clear_board: function() {
    var rows = this.rows();
    for(var r = 0; r < this.width(); r++) {
      for(var c = 0; c < this.height(); c++) {
        rows[c][r].on(false);
      }
    }
  },
  start: function() {
    if (!this.started()) {
      this.started(true);
      this.move_block();
    }
  },
  pause: function() {
    if (this.started()) {
      this.started(false);
    }
    else this.start();
  },
  set_next_block: function() {
    
    var block_output = '';
    var rows = block_types[this.player().next_block][0];
    for (var y = 0; y < rows.length; y++) {
      var row = rows[y];
      var line = '';
      for (var x = 0; x < row.length; x++) {
        if (row[x] != ' ') {
          block_output += '<div class="'+available_colors[this.player().next_block]+'"></div>';
        }
        else {
          block_output += '<div class="blank"></div>'; 
        }
      }
      block_output += '<br>';
    }

    this.next_block(block_output);
  },
  move_block: function() {
    var self = this;
    this.down();
    if (!this.game_over() && this.started()) {
      setTimeout(function(){
        self.move_block();
      }, self.speed());
    }
  },
  drop: function() {

  },
  down: function() {
    this.player().shift_down();
    this.render(this.player().board.block);
  },
  left: function() {
    this.player().shift_left();
    this.render(this.player().board.block);
  },
  right: function() {
    this.player().shift_right();
    this.render(this.player().board.block);
  },
  rotate: function() {
    this.player().rotate_left();
    this.render(this.player().board.block);
  },
  drop: function() {
    this.player().drop();
    this.render(this.player().board.block);
  },
  render: function(block) {
    
    if (this.next_block() !== this.player().next_block) {
      this.set_next_block();
    }
    
    var block_rows;
    var board_rows = this.player().board.rows;
    var rows = this.rows();
    var on, line;
    var width = this.width(), height = this.height();
    var x, y;

    // Render the board
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        on = (board_rows[y][x] !== ' ' && board_rows[y][x] !== '.');
        if (on && y < 2) {
          this.player().game_over = true;
          this.game_over(true);
        }
        rows[y][x].on(on);
      }
    }
    
    if (block && !this.game_over()) {
      block_rows = block.get_rows();

      // Render the block
      for (y = 0; y < block_rows.length; y++) {
        for (x = 0; x < block_rows[y].length; x++) {
          on = (block_rows[y][x] !== ' ');
          if (on) {
            rows[block.y + y][block.x + x].color(available_colors[block.type_index]);
            rows[block.y + y][block.x + x].on(true);
          }
        }
      }
    }
  }
};
