var _ = require('underscore')._;

var utils = require('./utils');

var templates = [
  [

    'x',
    'x',
    'o',    // pivot point
    'x'

  ],[

    'xx',   // no pivot point == no pivoting
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
}

Block.prototype = {
  get_rows: function() {
    return this.type[this.rotation];
  }
};