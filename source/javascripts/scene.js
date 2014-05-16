var sg = sg || {};

sg.Scene = function(context) {
  this.context = context;
  this.camera = new sg.cameras.Static(this.context);
  this.object = new sg.objects.Triangle(this.context);
  this.gl = this.context.gl;

  this.gl.enable(this.gl.DEPTH_TEST);
};

sg.Scene.prototype.draw = function() {
  this.context.setGLViewport();
  this.gl.clearColor(0.5, 0.5, 0, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  this.context.shaders.basic.use();
  this.context.shaders.basic.setProjectionMatrix(this.camera.getProjection());
  this.context.shaders.basic.setViewMatrix(this.camera.getView());

  var modelMatrix = mat4.create();
  this.object.draw(modelMatrix);
};

sg.Scene.prototype.tick = function(delta) {
  this.camera.tick(delta);
};

