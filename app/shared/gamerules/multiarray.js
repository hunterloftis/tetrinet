
module.exports = MultiArray;

function MultiArray(dimensions, default_val) {
  this.rows = [];
  if (dimensions) {
    var i;
    if (dimensions.length === 1) {       // Sentinel - stop when we're at the innermost array
      for (i = 0; i < dimensions[0]; i++) {
        this.rows[i] = default_val;
      }
    }
    else {
      for (i = 0; i < dimensions[0]; i++) {
        this.rows[i] = multi_array(dimensions.slice(1), default_val);
      }
    }
  }
}

MultiArray.prototype = Array;

MultiArray.prototype.load_strings = function(string_array) {
  var rows = [];
  for (var y = 0; y < string_array.length; y++) {
    var row = string_array[y];
    rows[y] = [];
    for (var x = 0; x < row.length; x++) {
      var val = row.slice(x, 1);
      rows[y].push(val);
    }
  }
  this.rows = rows;
};

MultiArray.prototype.rotated_copy = function(counter) {
  var height = array.length;
  var width = array[0].length;
  var rotated = multi_array([width, height], 'x'); // Inverted from (height, width)
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var target_x = counter ? height - y - 1 : y;
      var target_y = counter ? x : width - x - 1;
      rotated[target_y][target_x] = array[y][x];
    }
  }
  return rotated;
};

MultiArray.prototype.toString = function() {
  var rows = this.rows;
  var lines = [];
  for (var y = 0; y < rows.length; y++) {
    var row = rows[y];
    var line = '';
    for (var x = 0; x < row.length; x++) {
      line += row[x];
    }
    lines.push(line);
  }
  return lines.join('\n');
};
