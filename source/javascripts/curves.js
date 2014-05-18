var sg = sg || {};
sg.curves = sg.curves || {};

(function() {

  sg.curves.Circle = function(radius) {
    this.radius = radius;
  };

  sg.curves.Circle.prototype.evaluate = function(t) {
    return vec2.fromValues(
      this.radius * Math.cos(t),
      this.radius * Math.sin(t));
  };

  sg.curves.Circle.prototype.derivative = function(t) {
    return vec2.fromValues(
      this.radius * -Math.sin(t),
      this.radius * Math.cos(t));
  };

  sg.curves.Circle.prototype.lowerDomainBound = function() {
    return 0;
  };

  sg.curves.Circle.prototype.upperDomainBound = function() {
    return 2 * Math.PI;
  };

})();
