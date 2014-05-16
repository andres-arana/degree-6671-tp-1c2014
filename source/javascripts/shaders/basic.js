var sg = sg || {};
sg.shaders = sg.shaders || {};

sg.shaders.Basic = function(gl) {
  this.gl = gl;

  var fragmentShader = this.compileShader(
    this.gl.FRAGMENT_SHADER,
    this.getFragmentSource());

  var vertexShader = this.compileShader(
    this.gl.VERTEX_SHADER,
    this.getVertexSource());

  var program = this.gl.createProgram();
  this.gl.attachShader(program, vertexShader);
  this.gl.attachShader(program, fragmentShader);
  this.gl.linkProgram(program);

  if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
    throw "Unable to link shader program";
  }

  this.positionAttribute = this.gl.getAttribLocation(program, "position");
  this.gl.enableVertexAttribArray(this.positionAttribute);

  this.projectionUniform = this.gl.getUniformLocation(program, "projectionMatrix");
  this.viewUniform = this.gl.getUniformLocation(program, "viewMatrix");
  this.modelUniform = this.gl.getUniformLocation(program, "modelMatrix");

  this.shader = program;
};

sg.shaders.Basic.prototype.use = function() {
  this.gl.useProgram(this.shader);
};

sg.shaders.Basic.prototype.setProjectionMatrix = function(m) {
  this.gl.uniformMatrix4fv(this.projectionUniform, false, m);
};

sg.shaders.Basic.prototype.setViewMatrix = function(m) {
  this.gl.uniformMatrix4fv(this.viewUniform, false, m);
};

sg.shaders.Basic.prototype.setModelMatrix = function(m) {
  this.gl.uniformMatrix4fv(this.modelUniform, false, m);
};

sg.shaders.Basic.prototype.getPositionAttribute = function() {
  return this.shader.positionAttribute;
};

sg.shaders.Basic.prototype.compileShader = function(type, source) {
  var shader = this.gl.createShader(type);

  this.gl.shaderSource(shader, source);
  this.gl.compileShader(shader);

  if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
    throw "Unable to compile shader: " + this.gl.getShaderInfoLog(shader);
  }

  return shader;
}

sg.shaders.Basic.prototype.getFragmentSource = function() {
  return "\
  precision mediump float;\
\
  void main(void) {\
    gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);\
  }\
  ";
};

sg.shaders.Basic.prototype.getVertexSource = function() {
  return "\
  attribute vec3 position;\
\
  uniform mat4 projectionMatrix;\
  uniform mat4 viewMatrix;\
  uniform mat4 modelMatrix;\
\
  void main(void) {\
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\
  }\
  ";
};

