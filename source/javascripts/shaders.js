var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw "Unable to compile shader: " + gl.getShaderInfoLog(shader);
    }

    return shader;
  };

  sg.shaders.Basic = function(gl) {
    this.gl = gl;

    var fragmentShader = compileShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      "\
      precision mediump float;\
      \
      varying vec4 f_color;\
      \
      void main(void) {\
        gl_FragColor = f_color;\
      }");

    var vertexShader = compileShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      "\
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
        vec4 eyeVertexCoords = viewMatrix * modelMatrix * vec4(position, 1.0);\
        float distance = length(eyeVertexCoords) / 40.0;\
        gl_Position = projectionMatrix * eyeVertexCoords;\
        f_color = color / distance;\
        f_color.w = 1.0;\
      }");

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

})();
