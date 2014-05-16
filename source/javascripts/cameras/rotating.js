var sg = sg || {};
sg.cameras = sg.cameras || {};

sg.cameras.Rotating = function(context, center, distance) {
  this.context = context
  this.center = center;
  this.distance = distance;

  this.projectionMatrix = mat4.perspective(
    mat4.create(),
    Math.PI / 4,
    this.context.width / this.context.height,
    0.1,
    200.0
  );

  this.rho = 0;
  this.theta = 0;
};

sg.cameras.Rotating.prototype.getProjection = function() {
  return this.projectionMatrix;
};

sg.cameras.Rotating.prototype.getView = function() {
  var position = vec3.fromValues(
    this.distance * Math.sin(this.rho) * Math.cos(this.theta) + this.center[0],
    this.distance * Math.cos(this.rho) * Math.cos(this.theta) + this.center[1],
    this.distance * Math.sin(this.theta) + this.center[2]);

  return mat4.lookAt(
    mat4.create(),
    position,
    this.center,
    vec3.fromValues(0.0, 0.0, 1.0));
};

sg.cameras.Rotating.prototype.tick = function(delta) {

};

sg.cameras.Rotating.prototype.onMouseInput = function(deltaX, deltaY) {
  if (deltaX == 0 && deltaY == 0) {
    return;
  }

  console.log("Mouse input captured by camera: " + deltaX + ", " + deltaY);

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
