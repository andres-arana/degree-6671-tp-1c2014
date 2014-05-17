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

  sg.cameras.Rotating = function(context, center, distance) {
    this.context = context
    this.center = center;
    this.distance = distance;

    this.projectionMatrix = createPerspectiveProjection(context);

    this.rho = 0;
    this.theta = 0;
  };

  sg.cameras.Rotating.prototype.getProjection = function() {
    return this.projectionMatrix;
  };

  sg.cameras.Rotating.prototype.getView = function() {
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
  };

  sg.cameras.Rotating.prototype.getEyeLocation = function() {
    return rotateAroundCenter(
      this.center,
      this.rho,
      this.theta,
      this.distance)
  };

  sg.cameras.Rotating.prototype.tick = function(delta) {

  };

  sg.cameras.Rotating.prototype.onMouseInput = function(deltaX, deltaY) {
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
  };

})();
