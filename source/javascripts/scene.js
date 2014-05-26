var sg = sg || {};

(function() {

  sg.Scene = function(context, heightmap) {
    this.context = context;
    this.gl = this.context.gl;

    this.terrain = new sg.objects.Terrain(this.context, heightmap);
    this.track = new sg.objects.Track(this.context);
    this.train = new sg.objects.Train(this.context, this.track);

    this.rotatingCamera = {
      camera: new sg.cameras.Rotating(this.context, vec3.create(), 55),
    };

    this.trainFollowingCamera = {
      camera: new sg.cameras.TrainFollower(this.context, 55, this.train),
    };

    this.driverCamera = {
      camera : new sg.cameras.Driver(this.context, this.train),
    };

    this.rotatingCamera.next = this.trainFollowingCamera;
    this.trainFollowingCamera.next = this.driverCamera;
    this.driverCamera.next = this.rotatingCamera;
    this.currentCamera = this.rotatingCamera;

    this.gl.enable(this.gl.DEPTH_TEST);
  };

  sg.Scene.prototype.draw = function() {
    this.context.setGLViewport();
    this.gl.clearColor(0.7, 0.7, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.context.shaders.basic.use();

    this.context.shaders.basic.setProjectionMatrix(
      this.currentCamera.camera.getProjection());
    this.context.shaders.basic.setViewMatrix(
      this.currentCamera.camera.getView());

    var modelMatrix = mat4.create();
    this.terrain.draw(modelMatrix);

    var trackMatrix = mat4.clone(modelMatrix);
    mat4.translate(trackMatrix, trackMatrix, vec3.fromValues(0, 0, -12));
    this.track.draw(trackMatrix);

    var trainMatrix = mat4.clone(modelMatrix);
    this.train.draw(trainMatrix);
  };

  sg.Scene.prototype.tick = function(delta) {
    this.currentCamera.camera.tick(delta);
    this.train.tick(delta);
  };

  sg.Scene.prototype.onMouseMovement = function(event) {
    this.currentCamera.camera.onMouseInput(event.movementX, event.movementY);
  };

  sg.Scene.prototype.onKeyHeld = function(event) {
    this.currentCamera.camera.onKeyHeld(event.key);
  };

  sg.Scene.prototype.onKeyReleased = function(event) {
    this.currentCamera.camera.onKeyReleased(event.key);

    if (event.key == "c" || event.key == "C") {
      this.currentCamera = this.currentCamera.next;
    }
  };

})();
