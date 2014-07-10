var sg = sg || {};
sg.cameras = sg.cameras || {};

(function() {
  var utils = sg.cameras.utilities;

  sg.cameras.Driver = function(context, train) {
    this.context = context
    this.train = train;
    this.rho = 0;
    this.theta = 0;

    this.offsetTranslation = vec3.fromValues(0, 0, 9.4);

    this.projectionMatrix = mat4.create();
    mat4.perspective(
        this.projectionMatrix,
        Math.PI / 4,
        this.context.width / this.context.height,
        0.1,
        250.0);

    this.viewMatrix = mat4.create();
    this.center = vec3.create();
    this.centerDisplacement = vec3.fromValues(0, 0, 2);
    this.target = vec3.create();
    this.upVector = vec3.fromValues(0, 0, 1);

  }

  sg.cameras.Driver.prototype.getProjection = function() {
    return this.projectionMatrix;
  };

  sg.cameras.Driver.prototype.onMouseInput = function(x, y) {
    if (x == 0 && y == 0) {
      return;
    }

    if (x != 0) {
      this.rho += x * 0.005;
      this.rho = utils.cycleAngle(this.rho);
    }

    if (y != 0) {
      this.theta -= y * 0.005;
      this.theta = utils.clampAngle(this.theta);
    }
  }

  sg.cameras.Driver.prototype.getView = function() {
    vec3.set(
      this.target,
      Math.sin(this.rho),
      Math.cos(this.rho),
      Math.sin(this.theta));

    vec3.add(
      this.target,
      this.target,
      this.center);

    mat4.lookAt(
      this.viewMatrix,
      this.center,
      this.target,
      this.upVector);

    return this.viewMatrix;
  };

  sg.cameras.Driver.prototype.onKeyHeld = function () {

  };

  sg.cameras.Driver.prototype.onKeyReleased = function() {

  };

  sg.cameras.Driver.prototype.tick = function(delta) {
    var trainPosition = this.train.currentPosition();
    vec3.subtract(trainPosition, trainPosition, this.offsetTranslation);

    vec3.add(
      this.center,
      trainPosition,
      this.centerDisplacement);
  };
})();
