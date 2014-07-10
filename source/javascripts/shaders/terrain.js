var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {

  sg.shaders.Terrain = function(gl) {
    this.gl = gl;

    var fragmentShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      "fragment-terrain");

    var vertexShader = sg.shaders.utilities.compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      "vertex-terrain");

    var program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw "Unable to link shader program";
    }

    this.positionAttribute = this.gl.getAttribLocation(program, "position");
    this.normalAttribute = this.gl.getAttribLocation(program, "normal");
    this.texCoordsAttribute = this.gl.getAttribLocation(program, "texCoords");

    this.projectionUniform = this.gl.getUniformLocation(program, "projectionMatrix");
    this.modelViewUniform = this.gl.getUniformLocation(program, "modelViewMatrix");
    this.normalUniform = this.gl.getUniformLocation(program, "normalMatrix");
    this.samplerUniform = this.gl.getUniformLocation(program, "textureSampler");
    this.lightUniform = this.gl.getUniformLocation(program, "lightDirection");
    this.useClippingUniform = this.gl.getUniformLocation(program, "useClipping");
    this.clipPlaneUniform = this.gl.getUniformLocation(program, "clipPlane");
    this.modelUniform = this.gl.getUniformLocation(program, "modelMatrix");

    this.shader = program;
  };

  sg.shaders.Terrain.prototype.use = function() {
    this.gl.useProgram(this.shader);
    this.gl.enableVertexAttribArray(this.positionAttribute);
    this.gl.enableVertexAttribArray(this.normalAttribute);
    this.gl.enableVertexAttribArray(this.texCoordsAttribute);
    return this;
  };

  sg.shaders.Terrain.prototype.setProjectionMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.projectionUniform, false, m);
  };

  sg.shaders.Terrain.prototype.setModelViewMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelViewUniform, false, m);
  };

  sg.shaders.Terrain.prototype.setModelMatrix = function(m) {
    this.gl.uniformMatrix4fv(this.modelUniform, false, m);
  };

  sg.shaders.Terrain.prototype.setNormalMatrix = function(m) {
    this.gl.uniformMatrix3fv(this.normalUniform, false, m);
  };

  sg.shaders.Terrain.prototype.setTexture = function(t) {
    t.bind(0);
    this.gl.uniform1i(this.samplerUniform, 0);
  };

  sg.shaders.Terrain.prototype.setLightDirection = function(direction) {
    this.gl.uniform3fv(this.lightUniform, direction);
  };

  sg.shaders.Terrain.prototype.useClipPlane = function(v) {
    this.gl.uniform1i(this.useClippingUniform, true);
    this.gl.uniform4fv(this.clipPlaneUniform, v);
  };

  sg.shaders.Terrain.prototype.clearClipPlane = function() {
    this.gl.uniform1i(this.useClippingUniform, false);
  };

  sg.shaders.Terrain.prototype.getPositionAttribute = function() {
    return this.positionAttribute;
  };

  sg.shaders.Terrain.prototype.getNormalAttribute = function() {
    return this.normalAttribute;
  };

  sg.shaders.Terrain.prototype.getTexCoordsAttribute = function() {
    return this.texCoordsAttribute;
  };

})();
