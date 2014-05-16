var sg = sg || {};
sg.cameras = sg.cameras || {};

sg.cameras.Static = function(context) {
  this.context = context;

  this.viewMatrix = mat4.lookAt(
    mat4.create(),
    vec3.fromValues(0.0, 0.0, 10.0),
    vec3.fromValues(0.0, 0.0, 0.0),
    vec3.fromValues(0.0, 1.0, 0.0));

  this.projectionMatrix = mat4.perspective(
    mat4.create(),
    Math.PI / 4,
    this.context.width / this.context.height,
    0.1,
    100.0
  );

  this.angle = 0;
};

sg.cameras.Static.prototype.getProjection = function() {
  return this.projectionMatrix;
};

sg.cameras.Static.prototype.getView = function() {
  return this.viewMatrix;
};

sg.cameras.Static.prototype.tick = function(delta) {

}
