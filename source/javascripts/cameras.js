var sg = sg || {};
sg.cameras = sg.cameras || {};

(function() {

  function createPerspectiveProjection(context) {
    return mat4.perspective(
      mat4.create(),
      Math.PI / 4,
      context.width / context.height,
      0.1,
      200.0
    );
  };

  function rotateAroundCenter(center, rho, theta, distance) {
    var sinr = Math.sin(rho);
    var sint = Math.sin(theta);
    var cosr = Math.cos(rho);
    var cost = Math.cos(theta);

    return vec3.fromValues(
      distance * sinr * cost + center[0],
      distance * cosr * cost + center[1],
      distance * sint + center[2]
    );
  };

  function createRotatingView() {
    var position = rotateAroundCenter(
      this.center,
      this.rho,
      this.theta,
      this.distance);

    return mat4.lookAt(
      mat4.create(),
      position,
      this.center,
      vec3.fromValues(0.0, 0.0, 1.0));
  }

  function handleMouseRotation(deltaX, deltaY) {
    if (deltaX == 0 && deltaY == 0) {
      return;
    }

    if (deltaX != 0) {
      this.rho += deltaX * 0.005;
      if (this.rho > 2 * Math.PI) {
        this.rho -= 2 * Math.PI;
      } else if (this.rho < 0) {
        this.rho += 2 * Math.PI;
      }
    }

    if (deltaY != 0) {
      this.theta += deltaY * 0.005;
      if (this.theta >= Math.PI / 2) {
        this.theta = Math.PI / 2;
      } else if (this.theta <= -Math.PI / 2) {
        this.theta = -Math.PI / 2;
      }
    }
  }

  function handleKeyDown(key) {
    if (key == "w" || key == "W") {
      this.distance -= 0.3;
      this.distance = Math.max(this.distance, 1);
    } else if (key == "s" || key == "S") {
      this.distance += 0.3;
    }
  }

  function handleKeyUp(key) {
    if (key == "s" || key == "S") {
      this.distance -= 0.3;
      this.distance = Math.max(this.distance, 1);
    } else if (key == "w" || key == "W") {
      this.distance += 0.3;
    }
  };

  sg.cameras.Rotating = function(context, center, distance) {
    this.context = context
    this.center = center;
    this.distance = distance;
    this.rho = 0;
    this.theta = 0;

    this.projectionMatrix = createPerspectiveProjection(context);
  };

  sg.cameras.Rotating.prototype.getProjection = function() {
    return this.projectionMatrix;
  };

  sg.cameras.Rotating.prototype.getView = createRotatingView;

  sg.cameras.Rotating.prototype.onMouseInput = handleMouseRotation;

  sg.cameras.Rotating.prototype.onKeyHeld = handleKeyDown;

  sg.cameras.Rotating.prototype.onKeyReleased = handleKeyUp;

  sg.cameras.Rotating.prototype.tick = function(delta) {

  };

  sg.cameras.TrainFollower = function(context, distance, train) {
    this.context = context
    this.center = vec3.create();
    this.distance = distance;
    this.train = train;
    this.rho = 0;
    this.theta = 0;

    this.projectionMatrix = createPerspectiveProjection(context);
  }

  sg.cameras.TrainFollower.prototype.getProjection = function() {
    return this.projectionMatrix;
  };

  sg.cameras.TrainFollower.prototype.getView = createRotatingView;

  sg.cameras.TrainFollower.prototype.onMouseInput = handleMouseRotation;

  sg.cameras.TrainFollower.prototype.onKeyHeld = handleKeyDown;

  sg.cameras.TrainFollower.prototype.onKeyReleased = handleKeyUp;

  sg.cameras.TrainFollower.prototype.tick = function(delta) {
    this.center = this.train.currentPosition();
  };

  sg.cameras.Driver = function(context, train) {
    this.context = context
    this.center = vec3.create();
    this.train = train;
    this.rho = 0;
    this.theta = 0;

    this.projectionMatrix = createPerspectiveProjection(context);
  }

  sg.cameras.Driver.prototype.getProjection = function() {
    return this.projectionMatrix;
  };

  sg.cameras.Driver.prototype.onMouseInput = function(deltaX, deltaY) {
    if (deltaX == 0 && deltaY == 0) {
      return;
    }

    if (deltaX != 0) {
      this.rho += deltaX * 0.005;
      if (this.rho > 2 * Math.PI) {
        this.rho -= 2 * Math.PI;
      } else if (this.rho < 0) {
        this.rho += 2 * Math.PI;
      }
    }

    if (deltaY != 0) {
      this.theta -= deltaY * 0.005;
      if (this.theta >= Math.PI / 2) {
        this.theta = Math.PI / 2;
      } else if (this.theta <= -Math.PI / 2) {
        this.theta = -Math.PI / 2;
      }
    }
  }

  sg.cameras.Driver.prototype.getView = function() {
    var position = this.center;
    vec3.add(position, position, vec3.fromValues(0, 0, 2));

    var target = vec3.fromValues(
      Math.sin(this.rho),
      Math.cos(this.rho),
      Math.sin(this.theta));

    vec3.add(target, target, position);

    return mat4.lookAt(
      mat4.create(),
      position,
      target,
      vec3.fromValues(0.0, 0.0, 1.0));
  };

  sg.cameras.Driver.prototype.onKeyHeld = function () {

  };

  sg.cameras.Driver.prototype.onKeyReleased = function() {

  };

  sg.cameras.Driver.prototype.tick = function(delta) {
    this.center = this.train.currentPosition();
  };

})();
