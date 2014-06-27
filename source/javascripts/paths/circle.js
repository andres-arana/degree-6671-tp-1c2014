var sg = sg || {};
sg.paths = sg.paths || {};

(function() {
  sg.paths.Circle = function(radius) {
    this.radius = radius;
  };

  sg.paths.Circle.prototype.evaluate = function(t) {
    return vec2.fromValues(
      this.radius * Math.cos(t),
      this.radius * Math.sin(t));
  };

  sg.paths.Circle.prototype.derivative = function(t) {
    return vec2.fromValues(
      this.radius * -Math.sin(t),
      this.radius * Math.cos(t));
  };

  sg.paths.Circle.prototype.lowerDomainBound = function() {
    return 0;
  };

  sg.paths.Circle.prototype.upperDomainBound = function() {
    return 2 * Math.PI;
  };

})();
