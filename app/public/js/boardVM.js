var available_colors = ['red', 'green', 'blue', 'purple', 'orange', 'black', 'yellow'];

var radio = require('radio');
var BlockClass = require('./block');
var block_types = new BlockClass();
block_types = block_types.templates;

this.next_templates = {};

/**
 * individual blocks in grid
 */ 
function Block(options) {

  options = options || {};

  this.on = ko.observable(false);
  this.color = ko.observable('black');

}




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
  this.next_block = ko.observable(null);
  this.width = ko.observable(options.width || 12);
  this.height = ko.observable(options.height || 22);
  this.rows = ko.observableArray(multi_array([this.height(), this.width()], function() {
    return new Block();
  }));

  // Events
  radio('player.line_cleared').subscribe([function(player) {
    this.render();
  }, this]);

  radio('player.score_updated').subscribe([function(player) {
    var score = player.score;

    // set score observable
    this.score(score);

    // set high score
    if (this.score() > this.high_score()) {
      this.high_score(this.score());
      localStorage.high_score = this.high_score();
    }
  }, this]);

  radio('player.next_block').subscribe([function(player) {
    this.set_next_block();
  }, this]);

  radio('player.drop').subscribe([function(player) {
    this.render();
  }, this]);

  radio('game.start').subscribe([function(player) {
    this.game_over(false);
    this.started(true);
    this.render();
  }, this]);

  radio('game.stop').subscribe([function(player) {
    this.started(false);
  }, this]);

  radio('game.tick').subscribe([function(player) {
    this.render();
  }, this]);

}

Board.prototype = {
  start: function() {
    this.player().start();
  },
  toggle: function() {
    this.player().toggle();
  },
  set_next_block: function() {
    
    var type = this.player().next_block;

    // check cache for block
    if (next_templates[type]) {
      this.next_block(next_templates[type]);
    }

    // no cache, generate block code
    else {

      var block_output = '';
      var rows = block_types[type][0];
      for (var y = 0; y < rows.length; y++) {
        var row = rows[y];
        var line = '';
        for (var x = 0; x < row.length; x++) {
          if (row[x] != ' ') {
            block_output += '<div class="block '+available_colors[this.player().next_block]+'"></div>';
          }
          else {
            block_output += '<div class="blank block"></div>';
          }
        }
        block_output += '<br>';
      }

      this.next_block(block_output);

      // save rendered block to cache
      next_templates[type] = block_output;
    }
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
  render: function() {
    
    var block = this.player().board.block;

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
        rows[y][x].color('dark');
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
