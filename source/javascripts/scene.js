var sg = sg || {};

sg.Scene = function(context, heightmap) {
  this.context = context;
  this.camera = new sg.cameras.Rotating(this.context, vec3.fromValues(0, 0, 0), 50);
  this.terrain = new sg.geometries.Terrain(this.context, heightmap);
  this.water = new sg.geometries.Water(this.context, 6);
  this.arc = new sg.geometries.Arc(this.context, 16, 4, 1);
  this.gl = this.context.gl;

  this.gl.enable(this.gl.DEPTH_TEST);

  this.angle = 0;
};

sg.Scene.prototype.draw = function() {
  this.context.setGLViewport();
  this.gl.clearColor(0.8, 0.8, 1.0, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

  this.context.shaders.basic.use();
  this.context.shaders.basic.setProjectionMatrix(this.camera.getProjection());
  this.context.shaders.basic.setViewMatrix(this.camera.getView());

  var modelMatrix = mat4.create();
  // mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 0, -20));
  // this.context.shaders.basic.setColor(vec4.fromValues(0.4, 0.8, 0.2, 1.0));
  // this.terrain.draw(modelMatrix);

  // this.context.shaders.basic.setColor(vec4.fromValues(0.2, 0.4, 0.8, 0.5));
  // this.water.draw(modelMatrix);
  mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(10, 20, 1));
  this.context.shaders.basic.setColor(vec4.fromValues(0.4, 0.8, 0.2, 1.0));
  this.arc.draw(modelMatrix);
};

sg.Scene.prototype.tick = function(delta) {
  this.camera.tick(delta);
};

sg.Scene.prototype.onMouseMovement = function(event) {
  this.camera.onMouseInput(event.movementX, event.movementY);
};

