var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {

  sg.shaders.Water = function(gl) {
    this.gl = gl;

    var fragmentShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      "fragment-water");

    var vertexShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      "vertex-water");

    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw "Unable to link shader program";
    }

    this.positionAttribute = this.gl.getAttribLocation(program, "position");

    this.projectionUniform = this.gl.getUniformLocation(program, "projectionMatrix");
    this.modelViewUniform = this.gl.getUniformLocation(program, "modelViewMatrix");
    this.normalUniform = this.gl.getUniformLocation(program, "normalMatrix");

    this.phaseUniform = this.gl.getUniformLocation(program, "phase");
    this.ambientUniform = this.gl.getUniformLocation(program, "ambientReflectivity");
    this.diffuseUniform = this.gl.getUniformLocation(program, "diffuseReflectivity");
    this.specularUniform = this.gl.getUniformLocation(program, "specularReflectivity");
    this.shininessUniform = this.gl.getUniformLocation(program, "shininess");
    this.lightUniform = this.gl.getUniformLocation(program, "lightDirection");
    this.samplerUniform = this.gl.getUniformLocation(program, "textureSampler");

    this.shader = program;
  };

  sg.shaders.Water.prototype.use = function() {
    this.gl.useProgram(this.shader);
    this.gl.enableVertexAttribArray(this.positionAttribute);
    return this;
  };

  sg.shaders.Water.prototype.setProjectionMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.projectionUniform, false, m);
  };

  sg.shaders.Water.prototype.setModelViewMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelViewUniform, false, m);
  };

  sg.shaders.Water.prototype.setNormalMatrix = function(m) {
    this.gl.uniformMatrix3fv(this.normalUniform, false, m);
  };

  sg.shaders.Water.prototype.setAmbient = function(color) {
    this.gl.uniform3fv(this.ambientUniform, color);
  }

  sg.shaders.Water.prototype.setDiffuse = function(color) {
    this.gl.uniform3fv(this.diffuseUniform, color);
  }

  sg.shaders.Water.prototype.setSpecular = function(color) {
    this.gl.uniform3fv(this.specularUniform, color);
  }

  sg.shaders.Water.prototype.setShininess = function(value) {
    this.gl.uniform1f(this.shininessUniform, value);
  }

  sg.shaders.Water.prototype.setLightDirection = function(direction) {
    this.gl.uniform3fv(this.lightUniform, direction);
  };

  sg.shaders.Water.prototype.setPhase = function(phase) {
    this.gl.uniform1f(this.phaseUniform, phase / 500);
  };

  sg.shaders.Water.prototype.setBumpMap = function(t) {
    t.bind(0);
    this.gl.uniform1i(this.samplerUniform, 0);
  };

  sg.shaders.Water.prototype.getPositionAttribute = function() {
    return this.positionAttribute;
  };

})();
