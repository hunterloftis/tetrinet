function multi_array(dimensions, default_val) {
  var arr = [], i;
  if (dimensions.length === 1) {       // Sentinel - stop when we're at the innermost array
    for (i = 0; i < dimensions[0]; i++) {
      arr[i] = default_val;
    }
  }
  else {
    for (i = 0; i < dimensions[0]; i++) {
      arr[i] = multi_array(dimensions.slice(1), default_val);
    }
  }
  return arr;
}

function multi_array_from_strings(string_array) {
  var rows = [];
  for (var y = 0; y < string_array.length; y++) {
    var row = string_array[y];
    rows[y] = [];
    for (var x = 0; x < row.length; x++) {
      var val = row.substr(x, 1);
      rows[y].push(val);
    }
  }
  return rows;
}

function rotate_array(array, counter) {
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
}

function render_array(rows) {
  for (var y = 0; y < rows.length; y++) {
    var row = rows[y];
    var line = '';
    for (var x = 0; x < row.length; x++) {
      line += row[x];
    }
    console.log(line);
  }
}

var exporter = (typeof module != 'undefined') ? module.exports : window ;

exporter = {
  multi_array: multi_array,
  multi_array_from_strings: multi_array_from_strings,
  rotate_array: rotate_array,
  render_array: render_array
};