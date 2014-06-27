var sg = sg || {};

(function() {

  sg.Scene = function(context, heightmap) {
    this.context = context;
    this.gl = this.context.gl;

    this.lightDirection = vec3.fromValues(1, -1, 1);
    this.lightViewMatrix = mat3.create();
    this.transformedLightDirection = vec3.create();

    this.terrain = new sg.objects.Terrain(this.context);
    this.terrainModelMatrix = mat4.create();
    mat4.translate(
      this.terrainModelMatrix,
      this.terrainModelMatrix,
      vec3.fromValues(0, 0, -20));

    this.track = new sg.objects.Track(this.context);
    this.trackModelMatrix = mat4.create();
    mat4.translate(
      this.trackModelMatrix,
      this.trackModelMatrix,
      vec3.fromValues(0, 0, -12));

    this.train = new sg.objects.Train(this.context, this.track);
    this.trainMatrix = mat4.create();

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

    this.context.shader.use();
  };

  sg.Scene.prototype.draw = function() {
    this.context.setGLViewport();
    this.gl.clearColor(0.7, 0.7, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    var viewMatrix = this.currentCamera.camera.getView();

    this.context.shader.setProjectionMatrix(
      this.currentCamera.camera.getProjection());

    mat3.fromMat4(this.lightViewMatrix, viewMatrix);
    vec3.transformMat3(
      this.transformedLightDirection,
      this.lightDirection,
      this.lightViewMatrix);
    this.context.shader.setLightDirection(this.transformedLightDirection);

    this.terrain.draw(viewMatrix, this.terrainModelMatrix);

    // this.track.draw(viewMatrix, this.trackModelMatrix);

    // this.train.draw(viewMatrix, this.trainMatrix);
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
