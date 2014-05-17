var sg = sg || {};

sg.Scene = function(context, heightmap) {
  this.context = context;
  this.camera = new sg.cameras.Rotating(this.context, vec3.fromValues(0, 0, 0), 50);
  this.terrain = new sg.objects.Terrain(this.context, heightmap);
  this.train = new sg.objects.Train(this.context);
  this.gl = this.context.gl;

  this.gl.enable(this.gl.DEPTH_TEST);

  this.angle = 0;
};

sg.Scene.prototype.draw = function() {
  this.context.setGLViewport();
  this.gl.clearColor(0.7, 0.7, 1.0, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  this.context.shaders.basic.use();
  this.context.shaders.basic.setProjectionMatrix(this.camera.getProjection());
  this.context.shaders.basic.setViewMatrix(this.camera.getView());

  var modelMatrix = mat4.create();
  this.terrain.draw(modelMatrix);

  mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(24, 0, -10.25));
  mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
  mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.2, 0.2, 0.2));
  this.train.draw(modelMatrix);
};

sg.Scene.prototype.tick = function(delta) {
  this.camera.tick(delta);
};

sg.Scene.prototype.onMouseMovement = function(event) {
  this.camera.onMouseInput(event.movementX, event.movementY);
};

