var sg = sg || {};

(function() {

  vec3.angleBetween = function(v1, v2) {
    return Math.acos(vec3.dot(v1, v2));
  };

})();
