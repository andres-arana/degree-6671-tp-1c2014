var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {

  sg.shaders.Phong = function(gl) {
    this.gl = gl;

    var fragmentShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      "fragment-phong");

    var vertexShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      "vertex-phong");

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

    this.ambientUniform = this.gl.getUniformLocation(program, "ambientReflectivity");
    this.diffuseUniform = this.gl.getUniformLocation(program, "diffuseReflectivity");
    this.specularUniform = this.gl.getUniformLocation(program, "specularReflectivity");
    this.shininessUniform = this.gl.getUniformLocation(program, "shininess");
    this.lightUniform = this.gl.getUniformLocation(program, "lightDirection");

    this.shader = program;
  };

  sg.shaders.Phong.prototype.use = function() {
    this.gl.useProgram(this.shader);
    this.gl.enableVertexAttribArray(this.positionAttribute);
    this.gl.enableVertexAttribArray(this.normalAttribute);
  };

  sg.shaders.Phong.prototype.setProjectionMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.projectionUniform, false, m);
  };

  sg.shaders.Phong.prototype.setModelViewMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelViewUniform, false, m);
  };

  sg.shaders.Phong.prototype.setNormalMatrix = function(m) {
    this.gl.uniformMatrix3fv(this.normalUniform, false, m);
  };

  sg.shaders.Phong.prototype.setAmbient = function(color) {
    this.gl.uniform3fv(this.ambientUniform, color);
  }

  sg.shaders.Phong.prototype.setDiffuse = function(color) {
    this.gl.uniform3fv(this.diffuseUniform, color);
  }

  sg.shaders.Phong.prototype.setSpecular = function(color) {
    this.gl.uniform3fv(this.specularUniform, color);
  }

  sg.shaders.Phong.prototype.setShininess = function(value) {
    this.gl.uniform1f(this.shininessUniform, value);
  }

  sg.shaders.Phong.prototype.setLightDirection = function(direction) {
    this.gl.uniform3fv(this.lightUniform, direction);
  };

  sg.shaders.Phong.prototype.getPositionAttribute = function() {
    return this.positionAttribute;
  };

  sg.shaders.Phong.prototype.getNormalAttribute = function() {
    return this.normalAttribute;
  };

})();
