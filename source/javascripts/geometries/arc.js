var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Arc = function(context, r, l, t) {
    this.context = context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();

    // Precalculate data for each angle
    var delta = Math.PI / (r - 1);
    var precalculatedZ = [];
    var precalculatedX = [];
    for (var i = 0; i < r; i++) {
      precalculatedZ.push(Math.sin(i * delta));
      precalculatedX.push(Math.cos(i * delta));
    }

    var vertices = [];
    var deltaLongitude = 1 / (l - 1);
    for (var j = 0; j < l; j++) {
      for (var i = 0; i < r; i++) {
        vertices.push(precalculatedX[i]);
        vertices.push(j * deltaLongitude);
        vertices.push(precalculatedZ[i]);

        vertices.push(precalculatedX[i]);
        vertices.push(0);
        vertices.push(precalculatedZ[i]);
      }
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildOpenTriangularMeshIndices(r, l);
  };

  sg.geometries.Arc.prototype.draw = function(v, m) {
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
      this.gl.TRIANGLE_STRIP,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
