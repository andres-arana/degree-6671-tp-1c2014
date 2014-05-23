var sg = sg || {};

(function() {

  sg.Scene = function(context, heightmap) {
    this.context = context;
    this.gl = this.context.gl;

    this.camera = new sg.cameras.Rotating(this.context, vec3.fromValues(0, 0, 0), 55);
    this.terrain = new sg.objects.Terrain(this.context, heightmap);
    this.track = new sg.objects.Track(this.context);
    this.train = new sg.objects.Train(this.context, this.track);

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
    this.train.draw(trainMatrix);
  };

  sg.Scene.prototype.tick = function(delta) {
    this.camera.tick(delta);
    this.train.tick(delta);
  };

  sg.Scene.prototype.onMouseMovement = function(event) {
    this.camera.onMouseInput(event.movementX, event.movementY);
  };

  sg.Scene.prototype.onKeyHeld = function(event) {
    this.camera.onKeyHeld(event.key);
  };

  sg.Scene.prototype.onKeyReleased = function(event) {
    this.camera.onKeyReleased(event.key);
  };

})();
