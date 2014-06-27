var sg = sg || {};
sg.shaders = sg.shaders || {};

(function() {
  sg.shaders.utilities = {
    compileShader: function(gl, type, id) {
      var source = document.getElementById(id).innerHTML;
      var shader = gl.createShader(type);

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw "Unable to compile shader: " + gl.getShaderInfoLog(shader);
      }

      return shader;
    },

  };
})();
