var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Water = function(context, level) {
    this.context = context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();

    var vertices = [
      -50, -50, level, 0, 0, 1, 1, 0, 0, 0, 1, 0,
      50, -50, level, 0, 0, 1, 1, 0, 0, 0, 1, 0,
      -50, 50, level, 0, 0, 1, 1, 0, 0, 0, 1, 0,
      50, 50, level, 0, 0, 1, 1, 0, 0, 0, 1, 0,
    ];

    var indices = [
      0, 1, 2, 3
    ];

    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer =  buffers.buildIndexBuffer(indices);
  };

  sg.geometries.Water.prototype.draw = function(v, m) {
    mat4.multiply(this.modelViewMatrix, v, m);
    this.context.shader.setModelViewMatrix(this.modelViewMatrix)

    mat3.normalFromMat4(this.normalMatrix, this.modelViewMatrix);
    this.context.shader.setNormalMatrix(this.normalMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    var position = this.context.shader.getPositionAttribute();
    this.gl.vertexAttribPointer(position, 3, this.gl.FLOAT, false, 48, 0);

    var normal = this.context.shader.getNormalAttribute();
    this.gl.vertexAttribPointer(normal, 3, this.gl.FLOAT, false, 48, 12);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
