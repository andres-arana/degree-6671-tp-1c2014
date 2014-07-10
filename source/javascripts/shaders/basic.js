var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {

  sg.shaders.Basic = function(gl) {
    this.gl = gl;

    var fragmentShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      "fragment-basic");

    var vertexShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      "vertex-basic");

    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw "Unable to link shader program";
    }

    this.positionAttribute = this.gl.getAttribLocation(program, "position");
    this.normalAttribute = this.gl.getAttribLocation(program, "normal");

    this.projectionUniform = this.gl.getUniformLocation(program, "projectionMatrix");
    this.modelViewUniform = this.gl.getUniformLocation(program, "modelViewMatrix");
    this.normalUniform = this.gl.getUniformLocation(program, "normalMatrix");
    this.modelUniform = this.gl.getUniformLocation(program, "modelMatrix");

    this.ambientUniform = this.gl.getUniformLocation(program, "ambientReflectivity");
    this.diffuseUniform = this.gl.getUniformLocation(program, "diffuseReflectivity");
    this.specularUniform = this.gl.getUniformLocation(program, "specularReflectivity");
    this.shininessUniform = this.gl.getUniformLocation(program, "shininess");
    this.lightUniform = this.gl.getUniformLocation(program, "lightDirection");
    this.useClippingUniform = this.gl.getUniformLocation(program, "useClipping");
    this.clipPlaneUniform = this.gl.getUniformLocation(program, "clipPlane");

    this.shader = program;
  };

  sg.shaders.Basic.prototype.use = function() {
    this.gl.useProgram(this.shader);
    this.gl.enableVertexAttribArray(this.positionAttribute);
    this.gl.enableVertexAttribArray(this.normalAttribute);
    return this;
  };

  sg.shaders.Basic.prototype.setProjectionMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.projectionUniform, false, m);
  };

  sg.shaders.Basic.prototype.setModelViewMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelViewUniform, false, m);
  };

  sg.shaders.Basic.prototype.setModelMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelUniform, false, m);
  };

  sg.shaders.Basic.prototype.setNormalMatrix = function(m) {
    this.gl.uniformMatrix3fv(this.normalUniform, false, m);
  };

  sg.shaders.Basic.prototype.setAmbient = function(color) {
    this.gl.uniform3fv(this.ambientUniform, color);
  }

  sg.shaders.Basic.prototype.setDiffuse = function(color) {
    this.gl.uniform3fv(this.diffuseUniform, color);
  }

  sg.shaders.Basic.prototype.setSpecular = function(color) {
    this.gl.uniform3fv(this.specularUniform, color);
  }

  sg.shaders.Basic.prototype.setShininess = function(value) {
    this.gl.uniform1f(this.shininessUniform, value);
  }

  sg.shaders.Basic.prototype.setLightDirection = function(direction) {
    this.gl.uniform3fv(this.lightUniform, direction);
  };

  sg.shaders.Basic.prototype.useClipPlane = function(v) {
    this.gl.uniform1i(this.useClippingUniform, true);
    this.gl.uniform4fv(this.clipPlaneUniform, v);
  };

  sg.shaders.Basic.prototype.clearClipPlane = function() {
    this.gl.uniform1i(this.useClippingUniform, false);
  };

  sg.shaders.Basic.prototype.getPositionAttribute = function() {
    return this.positionAttribute;
  };

  sg.shaders.Basic.prototype.getNormalAttribute = function() {
    return this.normalAttribute;
  };

})();
