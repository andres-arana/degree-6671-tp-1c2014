var sg = sg || {};
sg.paths = sg.paths || {};

(function() {

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

})();
