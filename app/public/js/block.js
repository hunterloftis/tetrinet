var _ = require('underscore')._;

var utils = require('./utils');

var templates = [
  [

    'x',
    'x',
    'x',
    'x'

  ],[

    'xx',
    'xx'

  ],[

    ' x',
    ' x',
    'xx'

  ],[

    'x ',
    'x ',
    'xx'

  ],[

    'xx ',
    ' xx'

  ],[

    ' xx',
    'xx '

  ],[

    'xxx',
    ' x '

  ]
];

function load_templates(templates) {
  var types = [];
  _(templates).each(function(template, i) {
    var new_type = utils.multi_array_from_strings(template);
    if (i === 1) console.dir(new_type);
    types.push(new_type);
  });
  
  types = _(types).map(function(type) {
    var rotations = [];
    var last = type;
    for (var i = 0; i < 4; i++) {
      rotations.push(last);
      var rotated = utils.rotate_array(last, false);
      last = rotated;
    }
    return rotations;
  });

  return types;
}

var block_types = load_templates(templates);

for (var i = 0; i < 4; i++) {
  console.log('');
  console.log(i + ':');
  for (var r = 0; r < 4; r++) {
    console.log('');
    utils.render_array(block_types[i][r]);
  }
}

module.exports = Block;

function Block(type_index) {
  this.type = block_types[type_index];

}

Block.prototype = {
  load_templates: function() {
    
  }
};