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
})();
