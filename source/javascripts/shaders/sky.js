var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {

  sg.shaders.Sky = function(gl) {
    this.gl = gl;

    var fragmentShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      "fragment-sky");

    var vertexShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      "vertex-sky");

    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw "Unable to link shader program";
    }

    this.positionAttribute = this.gl.getAttribLocation(program, "position");
    this.texCoordsAttribute = this.gl.getAttribLocation(program, "texCoords");

    this.projectionUniform = this.gl.getUniformLocation(program, "projectionMatrix");
    this.modelViewUniform = this.gl.getUniformLocation(program, "modelViewMatrix");
    this.samplerUniform = this.gl.getUniformLocation(program, "textureSampler");
    this.useClippingUniform = this.gl.getUniformLocation(program, "useClipping");
    this.clipPlaneUniform = this.gl.getUniformLocation(program, "clipPlane");
    this.modelUniform = this.gl.getUniformLocation(program, "modelMatrix");

    this.shader = program;
  };

  sg.shaders.Sky.prototype.use = function() {
    this.gl.useProgram(this.shader);
    this.gl.enableVertexAttribArray(this.positionAttribute);
    this.gl.enableVertexAttribArray(this.texCoordsAttribute);
    return this;
  };

  sg.shaders.Sky.prototype.setProjectionMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.projectionUniform, false, m);
  };

  sg.shaders.Sky.prototype.setModelViewMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelViewUniform, false, m);
  };

  sg.shaders.Sky.prototype.setModelMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelUniform, false, m);
  };

  sg.shaders.Sky.prototype.setTexture = function(t) {
    t.bind(0);
    this.gl.uniform1i(this.samplerUniform, 0);
  };

  sg.shaders.Sky.prototype.useClipPlane = function(v) {
    this.gl.uniform1i(this.useClippingUniform, true);
    this.gl.uniform4fv(this.clipPlaneUniform, v);
  };

  sg.shaders.Sky.prototype.clearClipPlane = function() {
    this.gl.uniform1i(this.useClippingUniform, false);
  };

  sg.shaders.Sky.prototype.getPositionAttribute = function() {
    return this.positionAttribute;
  };

  sg.shaders.Sky.prototype.getTexCoordsAttribute = function() {
    return this.texCoordsAttribute;
  };
})();
