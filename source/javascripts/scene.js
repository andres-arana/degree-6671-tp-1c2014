var sg = sg || {};

sg.Scene = function(context) {
  this.context = context;
  this.camera = new sg.cameras.Static(this.context);
  this.object = new sg.objects.Triangle(this.context);
  this.gl = this.context.gl;

  this.gl.enable(this.gl.DEPTH_TEST);

  this.angle = 0;
};

sg.Scene.prototype.draw = function() {
  this.context.setGLViewport();
  this.gl.clearColor(0.6, 0.6, 1.0, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  this.context.shaders.basic.use();
  this.context.shaders.basic.setProjectionMatrix(this.camera.getProjection());
  this.context.shaders.basic.setViewMatrix(this.camera.getView());

  var modelMatrix = mat4.create();
  mat4.rotateX(modelMatrix, modelMatrix, this.angle);
  this.context.shaders.basic.setColor(vec4.fromValues(1.0, 0.5, 1.0, 1.0));
  this.object.draw(modelMatrix);
};

sg.Scene.prototype.tick = function(delta) {
  this.camera.tick(delta);

  this.angle += 0.001 * delta;

  if (this.angle >= Math.PI * 2) {
    this.angle -= Math.PI * 2;
  }
};

