var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {

  sg.shaders.Textured = function(gl) {
    this.gl = gl;

    var fragmentShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      "fragment-textured");

    var vertexShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      "vertex-textured");

    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw "Unable to link shader program";
    }

    this.positionAttribute = this.gl.getAttribLocation(program, "position");
    this.normalAttribute = this.gl.getAttribLocation(program, "normal");
    this.tangentAttribute = this.gl.getAttribLocation(program, "tangent");
    this.bitangentAttribute = this.gl.getAttribLocation(program, "bitangent");
    this.texCoordsAttribute = this.gl.getAttribLocation(program, "texCoords");

    this.projectionUniform = this.gl.getUniformLocation(program, "projectionMatrix");
    this.modelViewUniform = this.gl.getUniformLocation(program, "modelViewMatrix");
    this.normalUniform = this.gl.getUniformLocation(program, "normalMatrix");
    this.samplerUniform = this.gl.getUniformLocation(program, "textureSampler");
    this.bumpSampler = this.gl.getUniformLocation(program, "bumpSampler");
    this.lightUniform = this.gl.getUniformLocation(program, "lightDirection");
    this.specularUniform = this.gl.getUniformLocation(program, "specularReflectivity");
    this.shininessUniform = this.gl.getUniformLocation(program, "shininess");
    this.useClippingUniform = this.gl.getUniformLocation(program, "useClipping");
    this.clipPlaneUniform = this.gl.getUniformLocation(program, "clipPlane");
    this.modelUniform = this.gl.getUniformLocation(program, "modelMatrix");

    this.shader = program;
  };

  sg.shaders.Textured.prototype.use = function() {
    this.gl.useProgram(this.shader);
    this.gl.enableVertexAttribArray(this.positionAttribute);
    this.gl.enableVertexAttribArray(this.normalAttribute);
    this.gl.enableVertexAttribArray(this.tangentAttribute);
    this.gl.enableVertexAttribArray(this.bitangentAttribute);
    this.gl.enableVertexAttribArray(this.texCoordsAttribute);
    return this;
  };

  sg.shaders.Textured.prototype.setProjectionMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.projectionUniform, false, m);
  };

  sg.shaders.Textured.prototype.setModelViewMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelViewUniform, false, m);
  };

  sg.shaders.Textured.prototype.setModelMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelUniform, false, m);
  };

  sg.shaders.Textured.prototype.setNormalMatrix = function(m) {
    this.gl.uniformMatrix3fv(this.normalUniform, false, m);
  };

  sg.shaders.Textured.prototype.setTexture = function(t) {
    t.bind(0);
    this.gl.uniform1i(this.samplerUniform, 0);
  };

  sg.shaders.Textured.prototype.setBumpMap = function(t) {
    t.bind(1);
    this.gl.uniform1i(this.bumpSampler, 1);
  };

  sg.shaders.Textured.prototype.setSpecular = function(color) {
    this.gl.uniform3fv(this.specularUniform, color);
  }

  sg.shaders.Textured.prototype.setShininess = function(value) {
    this.gl.uniform1f(this.shininessUniform, value);
  }

  sg.shaders.Textured.prototype.setLightDirection = function(direction) {
    this.gl.uniform3fv(this.lightUniform, direction);
  };

  sg.shaders.Textured.prototype.useClipPlane = function(v) {
    this.gl.uniform1i(this.useClippingUniform, true);
    this.gl.uniform4fv(this.clipPlaneUniform, v);
  };

  sg.shaders.Textured.prototype.clearClipPlane = function() {
    this.gl.uniform1i(this.useClippingUniform, false);
  };

  sg.shaders.Textured.prototype.getPositionAttribute = function() {
    return this.positionAttribute;
  };

  sg.shaders.Textured.prototype.getNormalAttribute = function() {
    return this.normalAttribute;
  };

  sg.shaders.Textured.prototype.getTangentAttribute = function() {
    return this.tangentAttribute;
  };

  sg.shaders.Textured.prototype.getBitangentAttribute = function() {
    return this.bitangentAttribute;
  };

  sg.shaders.Textured.prototype.getTexCoordsAttribute = function() {
    return this.texCoordsAttribute;
  };

})();
