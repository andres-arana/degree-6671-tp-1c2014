var sg = sg || {};

(function() {

  sg.Scene = function(context, heightmap) {
    this.context = context;
    this.gl = this.context.gl;

    this.lightDirection = vec3.fromValues(1, -1, 1);
    this.reflectedLightDirection = vec3.fromValues(1, -1, -1);
    this.lightViewMatrix = mat3.create();
    this.transformedLightDirection = vec3.create();
    this.transformedReflectedLightDirection = vec3.create();

    this.waterClipPlane = vec4.fromValues(0, 0, -1, -16);

    this.reflectionMatrix = mat4.create();
    mat4.translate(
      this.reflectionMatrix,
      this.reflectionMatrix,
      vec3.fromValues(0, 0, -15));
    mat4.scale(
      this.reflectionMatrix,
      this.reflectionMatrix,
      vec3.fromValues(1, 1, -1));
    mat4.translate(
      this.reflectionMatrix,
      this.reflectionMatrix,
      vec3.fromValues(0, 0, 15));

    this.terrain = new sg.objects.Terrain(this.context);
    this.terrainMatrix = mat4.create();
    mat4.translate(
      this.terrainMatrix,
      this.terrainMatrix,
      vec3.fromValues(0, 0, -20));

    this.reflectedTerrainMatrix = mat4.mul(
      mat4.create(),
      this.reflectionMatrix,
      this.terrainMatrix);

    this.water = new sg.objects.Water(this.context);
    this.waterMatrix = mat4.create();
    mat4.translate(
      this.waterMatrix,
      this.waterMatrix,
      vec3.fromValues(0, 0, -15));

    this.reflectedWaterMatrix = mat4.mul(
      mat4.create(),
      this.reflectionMatrix,
      this.waterMatrix);

    this.skybox = new sg.objects.Skybox(this.context);
    this.skyboxMatrix = mat4.create();

    this.reflectedSkyboxMatrix = mat4.mul(
      mat4.create(),
      this.reflectionMatrix,
      this.skyboxMatrix);

    this.track = new sg.objects.Track(this.context);
    this.trackMatrix = mat4.create();
    mat4.translate(
      this.trackMatrix,
      this.trackMatrix,
      vec3.fromValues(0, 0, -12));

    this.reflectedTrackMatrix = mat4.mul(
      mat4.create(),
      this.reflectionMatrix,
      this.trackMatrix);

    this.trackBase = new sg.objects.TrackBase(this.context);
    this.trackBaseMatrix = mat4.create();
    mat4.translate(
      this.trackBaseMatrix,
      this.trackBaseMatrix,
      vec3.fromValues(0, 0, -12));

    this.reflectedTrackBaseMatrix = mat4.mul(
      mat4.create(),
      this.reflectionMatrix,
      this.trackBaseMatrix);

    this.train = new sg.objects.Train(this.context, this.track);
    this.trainMatrix = mat4.create();
    mat4.translate(
      this.trainMatrix,
      this.trainMatrix,
      vec3.fromValues(0, 0, -9.4));

    this.reflectedTrainMatrix = mat4.mul(
      mat4.create(),
      this.reflectionMatrix,
      this.trainMatrix);

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
    var shader;
    var viewMatrix = this.currentCamera.camera.getView();
    var projectionMatrix = this.currentCamera.camera.getProjection();
    mat3.fromMat4(this.lightViewMatrix, viewMatrix);

    vec3.transformMat3(
      this.transformedLightDirection,
      this.lightDirection,
      this.lightViewMatrix);
    vec3.transformMat3(
      this.transformedReflectedLightDirection,
      this.reflectedLightDirection,
      this.lightViewMatrix);

    // Render water reflection
    this.water.useReflectionFramebuffer();

    shader = this.context.shaders.basic.use();
    shader.useClipPlane(this.waterClipPlane);
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedReflectedLightDirection);
    this.train.draw(shader, viewMatrix, this.reflectedTrainMatrix);
    this.track.draw(shader, viewMatrix, this.reflectedTrackMatrix);
    shader.clearClipPlane();

    shader = this.context.shaders.textured.use();
    shader.useClipPlane(this.waterClipPlane);
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedReflectedLightDirection);
    this.trackBase.draw(shader, viewMatrix, this.reflectedTrackBaseMatrix);
    shader.clearClipPlane();

    shader = this.context.shaders.sky.use();
    shader.useClipPlane(this.waterClipPlane);
    shader.setProjectionMatrix(projectionMatrix);
    this.skybox.draw(shader, viewMatrix, this.reflectedSkyboxMatrix);
    shader.clearClipPlane();

    shader = this.context.shaders.terrain.use();
    shader.useClipPlane(this.waterClipPlane);
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedReflectedLightDirection);
    this.terrain.draw(shader, viewMatrix, this.reflectedTerrainMatrix);
    shader.clearClipPlane();

    this.water.clearReflectionFramebuffer();

    // // Render actual scene
    this.context.setGLViewport();
    this.gl.clearColor(0.7, 0.7, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    shader = this.context.shaders.basic.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.train.draw(shader, viewMatrix, this.trainMatrix);
    this.track.draw(shader, viewMatrix, this.trackMatrix);

    shader = this.context.shaders.textured.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.trackBase.draw(shader, viewMatrix, this.trackBaseMatrix);

    shader = this.context.shaders.sky.use();
    shader.setProjectionMatrix(projectionMatrix);
    this.skybox.draw(shader, viewMatrix, this.skyboxMatrix);

    shader = this.context.shaders.terrain.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.terrain.draw(shader, viewMatrix, this.terrainMatrix);

    shader = this.context.shaders.water.use();
    shader.setProjectionMatrix(projectionMatrix);
    shader.setLightDirection(this.transformedLightDirection);
    this.water.draw(shader, viewMatrix, this.waterMatrix);
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
