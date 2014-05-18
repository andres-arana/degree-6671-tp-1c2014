var sg = sg || {};
sg.curves = sg.curves || {};

(function() {

  sg.curves.Line = function(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
  };

  sg.curves.Line.prototype.evaluate = function(t) {
    return vec3.lerp(vec3.create(), this.p0, this.p1, t);
  };

  sg.curves.Line.prototype.derivative = function(t) {
    return vec3.subtract(vec3.create(), this.p1, this.p0);
  };

  sg.curves.Line.prototype.lowerDomainBound = function() {
    return 0;
  };

  sg.curves.Line.prototype.upperDomainBound = function() {
    return 1;
  };

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
