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

  this.shader = program;
};

sg.shaders.Basic.prototype.use = function() {
  this.gl.useProgram(this.shader);
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
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\
  }\
  ";
};

sg.shaders.Basic.prototype.getVertexSource = function() {
  return "\
  attribute vec3 position;\
\
  uniform mat4 modelViewMatrix;\
  uniform mat4 projectionMatrix;\
\
  void main(void) {\
    gl_Position = projectionMatrix *\
      modelViewMatrix *\
      vec4(position, 1.0);\
  }\
  ";
};

