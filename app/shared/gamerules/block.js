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
  rotate: function(counter) {
    if (this.rotates) {
      var rows = this.get_rows();
      var old_axis = rows.axis;
      if (counter) {
        this.rotation--;
        if (this.rotation < 0) this.rotation = 3;
      }
      else {
        this.rotation++;
        if (this.rotation > 3) this.rotation = 0;
      }
      rows = this.get_rows();
      var new_axis = rows.axis;
      var off_x = old_axis.x - new_axis.x;
      var off_y = old_axis.y - new_axis.y;
      this.x += off_x;
      this.y += off_y;
    }
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
  }
};