var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.TriangularBox = function(context) {
    this.context= context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();

    var vertices = [
      // Front face
      1, 1, 1,
      1, 1, -1,
      -1, 1, 1,
      -1, 1, -1,

      // Back face
      1, -1, 1,
      -1, -1 ,1
    ];

    var indices = [
      0, 1, 2, 1, 3, 2, // Front face
      0, 4, 1, // Left face
      2, 3, 5, // Right face
      0, 2, 4, 4, 2, 5, // Top face
      1, 4, 5, 1, 5, 3, // Back face
    ];

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildIndexBuffer(indices);
  };

  sg.geometries.TriangularBox.prototype.draw = function(v, m) {
    this.context.shaders.basic.use();
    mat4.multiply(this.modelViewMatrix, v, m);
    this.context.shaders.basic.setModelViewMatrix(this.modelViewMatrix)

    var attribute = this.context.shaders.basic.getPositionAttribute();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(attribute, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
