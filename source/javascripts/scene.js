var sg = sg || {};

sg.Scene = function(context, heightmap) {
  this.context = context;
  this.camera = new sg.cameras.Rotating(this.context, vec3.fromValues(0, 0, 0), 50);
  this.terrain = new sg.objects.Terrain(this.context, heightmap);
  this.train = new sg.objects.Train(this.context);
  this.extrussion = new sg.geometries.Extrussion(
    this.context,
    new sg.paths.BSpline(vec2, [
      vec2.fromValues(-1, 0),
      vec2.fromValues(-1, 2),
      vec2.fromValues(-3, 2),
      vec2.fromValues(-3, 3),
      vec2.fromValues(0, 3),
      vec2.fromValues(3, 3),
      vec2.fromValues(3, 2),
      vec2.fromValues(1, 2),
      vec2.fromValues(1, 0),
      vec2.fromValues(1, -2),
      vec2.fromValues(3, -2),
      vec2.fromValues(3, -3),
      vec2.fromValues(0, -3),
      vec2.fromValues(-3, -3),
      vec2.fromValues(-3, -2),
      vec2.fromValues(-1, -2),
      vec2.fromValues(-1, 0),
      vec2.fromValues(-1, 2),
    ]),
    new sg.paths.Line(vec3,
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(0, 10, 0)
    ),
    50, 10);

  this.gl = this.context.gl;

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
  this.context.shaders.basic.setColor(vec4.fromValues(0.5, 0.5, 0.8, 0.5));
  this.extrussion.draw(modelMatrix);
  // this.terrain.draw(modelMatrix);

  // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(24, 0, -10.25));
  // mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
  // mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.2, 0.2, 0.2));
  // this.train.draw(modelMatrix);
};

sg.Scene.prototype.tick = function(delta) {
  this.camera.tick(delta);
};

sg.Scene.prototype.onMouseMovement = function(event) {
  this.camera.onMouseInput(event.movementX, event.movementY);
};

