var sg = sg || {};

sg.Scene = function(context, heightmap) {
  this.context = context;
  this.gl = this.context.gl;

  this.camera = new sg.cameras.Rotating(this.context, vec3.fromValues(0, 0, 0), 55);
  this.terrain = new sg.objects.Terrain(this.context, heightmap);
  this.train = new sg.objects.Train(this.context);
  this.track = new sg.objects.Track(this.context);

  this.gl.enable(this.gl.DEPTH_TEST);
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

  var trackMatrix = mat4.clone(modelMatrix);
  mat4.translate(trackMatrix, trackMatrix, vec3.fromValues(0, 0, -12));
  this.track.draw(trackMatrix);

  var trainMatrix = mat4.clone(modelMatrix);
  var trainPosition = this.track.path.evaluate(0);
  vec3.subtract(trainPosition, trainPosition, vec3.fromValues(0, 0, 9.4));
  mat4.translate(trainMatrix, trainMatrix, trainPosition);
  mat4.rotateZ(trainMatrix, trainMatrix, Math.PI / 2);
  mat4.scale(trainMatrix, trainMatrix, vec3.fromValues(0.2, 0.2, 0.2));
  this.train.draw(trainMatrix);
};

sg.Scene.prototype.tick = function(delta) {
  this.camera.tick(delta);
};

sg.Scene.prototype.onMouseMovement = function(event) {
  this.camera.onMouseInput(event.movementX, event.movementY);
};

