var sg = sg || {};

sg.Scene = function(gl) {
  this.gl = gl;
  this.red = 0.0;
  this.green = 0.0;
  this.blue = 0.0;

  this.gl.enable(this.gl.DEPTH_TEST);
};

sg.Scene.prototype.draw = function() {
  this.gl.clearColor(this.red, this.green, this.blue, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}

sg.Scene.prototype.tick = function(delta) {
  if (this.red < 1.0) {
    this.red += 0.0001 * delta;
  } else if (this.green < 1.0) {
    this.green += 0.0001 * delta;
  } else if (this.blue < 1.0) {
    this.blue += 0.0001 * delta;
  }
};

