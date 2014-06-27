var sg = sg || {};
sg.paths = sg.paths || {};

(function() {

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
