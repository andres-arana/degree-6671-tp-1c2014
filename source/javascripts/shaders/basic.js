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
  this.colorUniform = this.gl.getUniformLocation(program, "color");

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

sg.shaders.Basic.prototype.setColor = function(color) {
  this.gl.uniform4fv(this.colorUniform, color);
}

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
  varying vec4 f_color;\
\
  void main(void) {\
    gl_FragColor = f_color;\
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
  uniform vec4 color;\
\
  varying vec4 f_color;\
\
  void main(void) {\
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);\
    f_color = color;\
  }\
  ";
};

