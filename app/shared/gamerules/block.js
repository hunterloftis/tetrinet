var _ = require('underscore')._;

var utils = require('./utils');

var templates = [
  [

    'x',
    'x',
    'o',    // pivot point
    'x'

  ],[

    'zx',   // no pivot point == no pivoting, z = this is the reference point`
    'xx'

  ],[

    ' x',
    ' o',
    'xx'

  ],[

    'x ',
    'o ',
    'xx'

  ],[

    'xo ',
    ' xx'

  ],[

    ' ox',
    'xx '

  ],[

    'xox',
    ' x '

  ]
];

function load_templates(templates) {
  var types = [];
  _(templates).each(function(template, i) {
    var new_type = utils.multi_array_from_strings(template);
    types.push(new_type);
  });
  
  types = _(types).map(function(type) {
    var rotations = [];
    var last = type;
    for (var i = 0; i < 4; i++) {
      rotations.push(last);
      var rotated = utils.rotate_array(last, true);
      last = rotated;
    }
    return rotations;
  });

  return types;
}

var block_types = load_templates(templates);

module.exports = Block;

function Block(type_index, options) {
  this.type = block_types[type_index];
  this.rotation = 0;
  this.x = 0;
  this.y = 0;
  _.extend(this, options);
  this.rotates = this.find_rotation_points();
}

Block.prototype = {
  get_rows: function() {
    return this.type[this.rotation];
  },
  rotate: function(board, counter) {
    if (this.rotates) {

      var rows, old_axis, snapshot, new_axis, off_x, off_y, dimensions, bounds;

      // Save our position and rotation
      snapshot = this.take_snapshot();

      // Perform the rotation
      rows = this.get_rows();
      old_axis = rows.axis;
      if (counter) {
        this.rotation--;
        if (this.rotation < 0) this.rotation = 3;
      }
      else {
        this.rotation++;
        if (this.rotation > 3) this.rotation = 0;
      }
      rows = this.get_rows();
      new_axis = rows.axis;
      off_x = old_axis.x - new_axis.x;
      off_y = old_axis.y - new_axis.y;
      this.x += off_x;
      this.y += off_y;

      // Check against left/right bounds
      rows = this.get_rows();
      dimensions = utils.get_dimensions(rows);
      bounds = utils.get_dimensions(board);
      if (this.x + dimensions.width > bounds.width) {
        if (this.fits(board, this.y, bounds.width - dimensions.width)) {
          this.x = bounds.width - dimensions.width;
          // Rotation worked after displacement from the right bound
          return true;
        }
        else {
          // Reset original position and bail
          this.restore_snapshot(snapshot);
          return false;
        }
      }
      else if (this.x < 0) {
        if (this.fits(board, this.y, 0)) {
          this.x = 0;
          // Rotation worked after displacement from the left bound
          return true;
        }
        // Reset original position and bail
        this.restore_snapshot(snapshot);
        return false;
      }
      // Rotation worked
      return true;
    }
    else return false;
  },
  take_snapshot: function() {
    return {
      rotation: this.rotation,
      x: this.x,
      y: this.y
    };
  },
  restore_snapshot: function(snapshot) {
    this.rotation = snapshot.rotation;
    this.x = snapshot.x;
    this.y = snapshot.y;
  },
  find_rotation_points: function() {
    var rotates = false;
    _(this.type).each(function(grid) {
      var axis = utils.find_coords(grid, 'o');
      if (axis) {
        grid.axis = axis;
        rotates = true;
      }
    });
    return rotates;
  },
  fits: function(board, target_y, target_x) {
    var rows = this.get_rows();
    var dimensions = utils.get_dimensions(rows);
    var bounds = utils.get_dimensions(board);

    // Are we still on the board?
    if (target_y < 0 || target_x < 0) return false;
    if (target_y + dimensions.height > bounds.height || target_x + dimensions.width > bounds.width) return false;

    // Are we free of overlap with existing tiles?
    for (var y = 0; y < dimensions.height; y++) {
      for (var x = 0; x < dimensions.width; x++) {
        var board_tile = (board[y + target_y][x + target_x] === ' ' || board[y + target_y][x + target_x] === '.') ? false : true;
        var this_tile = (rows[y][x] === ' ' || rows[y][x] === '.') ? false : true;
        if (board_tile && this_tile) return false;
      }
    }

    // ...yep.
    return true;
  }
};