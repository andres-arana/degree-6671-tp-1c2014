var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Water = function(context, level) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [
      -50, -50, level,
      50, -50, level,
      -50, 50, level,
      50, 50, level
    ];

    var indices = [
      0, 1, 2, 3
    ];

    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer =  buffers.buildIndexBuffer(indices);
  };

  sg.geometries.Water.prototype.draw = function(v, m) {
    this.context.shaders.basic.use();
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, v, m);
    this.context.shaders.basic.setModelViewMatrix(modelViewMatrix)

    var attribute = this.context.shaders.basic.getPositionAttribute();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(attribute, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
