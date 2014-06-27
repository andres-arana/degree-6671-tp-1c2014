var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.TriangularBox = function(context) {
    this.context= context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();

    var vertices = [
      // Top face
      -1 , -1 , 1 , 0 , 0 , 1 ,
       1 , -1 , 1 , 0 , 0 , 1 ,
       1 ,  1 , 1 , 0 , 0 , 1 ,
      -1 ,  1 , 1 , 0 , 0 , 1 ,

      // Front face
      -1 , 1 , -1 , 0 , 1 , 0 ,
      -1 , 1 ,  1 , 0 , 1 , 0 ,
       1 , 1 ,  1 , 0 , 1 , 0 ,
       1 , 1 , -1 , 0 , 1 , 0 ,

      // Back face
      -1 ,  1 , -1 , 0 , -1 , -1 ,
       1 ,  1 , -1 , 0 , -1 , -1 ,
       1 , -1 ,  1 , 0 , -1 , -1 ,
      -1 , -1 ,  1 , 0 , -1 , -1 ,

      // Right face
      1 ,  1 , -1 , 1 , 0 , 0 ,
      1 ,  1 ,  1 , 1 , 0 , 0 ,
      1 , -1 ,  1 , 1 , 0 , 0 ,

      // Left face
      -1 , -1 ,  1 , -1 , 0 , 0 ,
      -1 ,  1 ,  1 , -1 , 0 , 0 ,
      -1 ,  1 , -1 , -1 , 0 , 0 ,
    ];

    var indices = [
      0, 1, 2,      0, 2, 3,    // Top face
      4, 5, 6,      4, 6, 7,    // Front face
      8, 9, 10,     8, 10, 11,  // Back face
      12, 14, 13,               // Right face
      15, 17, 16,               // Left face
    ];

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildIndexBuffer(indices);
  };

  sg.geometries.TriangularBox.prototype.draw = function(v, m) {
    mat4.multiply(this.modelViewMatrix, v, m);
    this.context.shader.setModelViewMatrix(this.modelViewMatrix)

    mat3.normalFromMat4(this.normalMatrix, this.modelViewMatrix);
    this.context.shader.setNormalMatrix(this.normalMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    var position = this.context.shader.getPositionAttribute();
    this.gl.vertexAttribPointer(position, 3, this.gl.FLOAT, false, 24, 0);

    var normal = this.context.shader.getNormalAttribute();
    this.gl.vertexAttribPointer(normal, 3, this.gl.FLOAT, false, 24, 12);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
