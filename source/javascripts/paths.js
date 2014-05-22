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

  sg.paths.Line = function(type, p0, p1) {
    this.type = type;
    this.p0 = p0;
    this.p1 = p1;
  };

  sg.paths.Line.prototype.evaluate = function(t) {
    return this.type.lerp(this.type.create(), this.p0, this.p1, t);
  };

  sg.paths.Line.prototype.derivative = function(t) {
    return this.type.subtract(this.type.create(), this.p1, this.p0);
  };

  sg.paths.Line.prototype.lowerDomainBound = function() {
    return 0;
  };

  sg.paths.Line.prototype.upperDomainBound = function() {
    return 1;
  };

  sg.paths.BSpline = function(type, points) {
    this.type = type;
    this.points = points;
  };

  sg.paths.BSpline.prototype.evaluate = function(t) {
    var clamped = Math.min(this.upperDomainBound(), t);
    var index = Math.floor(clamped);
    if (index >= 1 && clamped == index) index -= 1;
    var u = clamped - index;
    var un = 1 - u;

    var result = this.type.scale(this.type.create(), this.points[index], 0.5 * un * un);
    this.type.scaleAndAdd(result, result, this.points[index + 1], 0.5 + un * u);
    return this.type.scaleAndAdd(result, result, this.points[index + 2], 0.5 * u * u);
  };

  sg.paths.BSpline.prototype.derivative = function(t) {
    var clamped = Math.min(this.upperDomainBound(), t);
    var index = Math.floor(clamped);
    if (index >= 1 && clamped == index) index -= 1;
    var u = clamped - index;

    var result = this.type.scale(this.type.create(), this.points[index], u - 1);
    this.type.scaleAndAdd(result, result, this.points[index + 1], 1 - 2 * u);
    return this.type.scaleAndAdd(result, result, this.points[index + 2], u);
  };

  sg.paths.BSpline.prototype.lowerDomainBound = function() {
    return 0;
  };

  sg.paths.BSpline.prototype.upperDomainBound = function() {
    return this.points.length - 2;
  };

  sg.paths.BSpline.prototype.transform = function(m) {
    var result = [];
    for (var i = 0; i < this.points.length; i++) {
      var transformed = this.type.transformMat4(
        this.type.create(),
        this.points[i],
        m);

      result.push(transformed);
    }
    return new sg.paths.BSpline(this.type, result);
  };

  sg.paths.Bezier = function(type, p0, p1, p2, p3) {
    this.type = type;
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

  };

  sg.paths.Bezier.prototype.evaluate = function(t) {
    var tn = 1 - t;
    var result = this.type.scale(this.type.create(), this.p0, tn * tn * tn);
    this.type.scaleAndAdd(result, result, this.p1, 3 * t * tn * tn);
    this.type.scaleAndAdd(result, result, this.p2, 3 * t * t * tn);
    this.type.scaleAndAdd(result, result, this.p3, t * t * t);
    return result;
  };

  sg.paths.Bezier.prototype.derivative = function(t) {
    var tn = 1 - t;
    var result = this.type.scale(this.type.create(), this.p0, -3 * tn * tn);
    this.type.scaleAndAdd(result, result, this.p1, 3 * tn * (tn - 2 * t));
    this.type.scaleAndAdd(result, result, this.p2, 6 * t - 9 * t * t);
    this.type.scaleAndAdd(result, result, this.p3, 3 * t * t);
    return result;
  };

  sg.paths.Bezier.prototype.lowerDomainBound = function() {
    return 0;
  };

  sg.paths.Bezier.prototype.upperDomainBound = function() {
    return 1;
  };

})();
