var sg = sg || {};
sg.cameras = sg.cameras || {};

(function() {
  var utils = sg.cameras.utilities;

  sg.cameras.TrainFollower = function(context, distance, train) {
    this.context = context
    this.distance = distance;
    this.train = train;
    this.rho = 0;
    this.theta = 0;

    this.projectionMatrix = mat4.create();
    mat4.perspective(
        this.projectionMatrix,
        Math.PI / 4,
        this.context.width / this.context.height,
        0.1,
        250.0);

    this.viewMatrix = mat4.create();
    this.center = vec3.create();
    this.position = vec3.create();
    this.upVector = vec3.fromValues(0, 0, 1);
  }

  sg.cameras.TrainFollower.prototype.getProjection = function() {
    return this.projectionMatrix;
  };

  sg.cameras.TrainFollower.prototype.getView = function() {
    utils.rotateAroundCenter(
      this.position,
      this.center,
      this.rho,
      this.theta,
      this.distance);

    mat4.lookAt(
      this.viewMatrix,
      this.position,
      this.center,
      this.upVector);

    return this.viewMatrix;
  };

  sg.cameras.TrainFollower.prototype.onMouseInput = function(x, y) {
    if (x == 0 && y == 0) {
      return;
    }

    if (x != 0) {
      this.rho += x * 0.005;
      this.rho = utils.cycleAngle(this.rho);
    }

    if (y != 0) {
      this.theta += y * 0.005;
      this.theta = utils.clampAngle(this.theta);
    }
  };

  sg.cameras.TrainFollower.prototype.onKeyHeld = function(key) {
    if (key == "w" || key == "W") {
      this.distance -= 0.3;
      this.distance = Math.max(this.distance, 1);
    } else if (key == "s" || key == "S") {
      this.distance += 0.3;
    }
  };

  sg.cameras.TrainFollower.prototype.onKeyReleased = function(key) {
    if (key == "s" || key == "S") {
      this.distance -= 0.3;
      this.distance = Math.max(this.distance, 1);
    } else if (key == "w" || key == "W") {
      this.distance += 0.3;
    }
  };

  sg.cameras.TrainFollower.prototype.tick = function(delta) {
    this.center = this.train.currentPosition();
  };
})();
