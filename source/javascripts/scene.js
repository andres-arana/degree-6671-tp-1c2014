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

    this.water = new sg.objects.Water(this.context);
    this.waterModelMatrix = mat4.create();
    mat4.translate(
      this.waterModelMatrix,
      this.waterModelMatrix,
      vec3.fromValues(0, 0, -15));

    this.skybox = new sg.objects.Skybox(this.context);
    this.skyboxModelMatrix = mat4.create();

    this.track = new sg.objects.Track(this.context);
    this.trackModelMatrix = mat4.create();
    mat4.translate(
      this.trackModelMatrix,
      this.trackModelMatrix,
      vec3.fromValues(0, 0, -12));

    this.trackBase = new sg.objects.TrackBase(this.context);
    this.trackBaseModelMatrix = mat4.create();
    mat4.translate(
      this.trackBaseModelMatrix,
      this.trackBaseModelMatrix,
      vec3.fromValues(0, 0, -12));


    this.train = new sg.objects.Train(this.context, this.track);
    this.trainMatrix = mat4.create();

    this.rotatingCamera = {
      camera: new sg.cameras.Rotating(this.context, vec3.create(), 20),
    };

    this.trainFollowingCamera = {
      camera: new sg.cameras.TrainFollower(this.context, 30, this.train),
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

    var viewMatrix = this.currentCamera.camera.getView();
    var projectionMatrix = this.currentCamera.camera.getProjection();
    mat3.fromMat4(this.lightViewMatrix, viewMatrix);
    vec3.transformMat3(
      this.transformedLightDirection,
      this.lightDirection,
      this.lightViewMatrix);

    var shader = this.context.shaders.basic.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.train.draw(shader, viewMatrix, this.trainMatrix);
    this.track.draw(shader, viewMatrix, this.trackModelMatrix);

    shader = this.context.shaders.textured.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.trackBase.draw(shader, viewMatrix, this.trackBaseModelMatrix);

    shader = this.context.shaders.sky.use();
    shader.setProjectionMatrix(projectionMatrix);
    this.skybox.draw(shader, viewMatrix, this.skyboxModelMatrix);

    shader = this.context.shaders.terrain.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.terrain.draw(shader, viewMatrix, this.terrainModelMatrix);

    shader = this.context.shaders.water.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.water.draw(shader, viewMatrix, this.waterModelMatrix);
  };

  sg.Scene.prototype.tick = function(delta) {
    this.currentCamera.camera.tick(delta);
    this.train.tick(delta);
    this.water.tick(delta);
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
