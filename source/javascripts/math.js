var sg = sg || {};

(function() {

  vec3.angleBetween = function(v1, v2) {
    return Math.acos(vec3.dot(v1, v2));
  };

  Math.cycle = function(value, min, max) {
    var result = value;
    if (value < min) {
      result += (max - min);
    } else if (value > max) {
      result -= (max - min);
    }

    return result;
  };

})();
