var sg = sg || {};

sg.Scene = function(context) {
  this.context = context;
  this.gl = this.context.gl;

  this.gl.enable(this.gl.DEPTH_TEST);
};

sg.Scene.prototype.draw = function() {
  this.context.setGLViewport();
  this.gl.clearColor(0, 0, 0, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
}

sg.Scene.prototype.tick = function(delta) {

};

