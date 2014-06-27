var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Box = function(context) {
    this.context = context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();

    var vertices = [
      // Front face
      -1 , -1 , 1 , 0 , 0 , 1 ,
       1 , -1 , 1 , 0 , 0 , 1 ,
       1 ,  1 , 1 , 0 , 0 , 1 ,
      -1 ,  1 , 1 , 0 , 0 , 1 ,

      // Back face
      -1 , -1 , -1 , 0 , 0 , -1 ,
      -1 ,  1 , -1 , 0 , 0 , -1 ,
       1 ,  1 , -1 , 0 , 0 , -1 ,
       1 , -1 , -1 , 0 , 0 , -1 ,

      // Top face
      -1 , 1 , -1 , 0 , 1 , 0 ,
      -1 , 1 ,  1 , 0 , 1 , 0 ,
       1 , 1 ,  1 , 0 , 1 , 0 ,
       1 , 1 , -1 , 0 , 1 , 0 ,

      // Bottom face
      -1 , -1 , -1 , 0 , -1 , 0 ,
       1 , -1 , -1 , 0 , -1 , 0 ,
       1 , -1 ,  1 , 0 , -1 , 0 ,
      -1 , -1 ,  1 , 0 , -1 , 0 ,

      // Right face
      1 , -1 , -1 , 1 , 0 , 0 ,
      1 ,  1 , -1 , 1 , 0 , 0 ,
      1 ,  1 ,  1 , 1 , 0 , 0 ,
      1 , -1 ,  1 , 1 , 0 , 0 ,

      // Left face
      -1 , -1 , -1 , -1 , 0 , 0 ,
      -1 , -1 ,  1 , -1 , 0 , 0 ,
      -1 ,  1 ,  1 , -1 , 0 , 0 ,
      -1 ,  1 , -1 , -1 , 0 , 0 ,
    ];

    var indices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildIndexBuffer(indices);
  };

  sg.geometries.Box.prototype.draw = function(v, m) {
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
