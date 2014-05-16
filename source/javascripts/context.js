var sg = sg || {};

sg.Context = function(canvas) {
  this.width = canvas.width;
  this.height = canvas.height;
  this.gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
  this.shaders = {
    basic: new sg.shaders.Basic(this.gl)
  };
}

sg.Context.prototype.setGLViewport = function() {
  this.gl.viewport(0, 0, this.width, this.height);
}

