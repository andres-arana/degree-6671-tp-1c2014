var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Arc = function(context, r, l, t) {
    this.context = context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();

    // Precalculate data for each angle
    var delta = Math.PI / (r - 1);
    var precalculatedZ = [];
    var precalculatedX = [];
    for (var i = 0; i < r; i++) {
      precalculatedZ.push(Math.sin(i * delta));
      precalculatedX.push(Math.cos(i * delta));
    }

    var vertices = [];
    // Add front face degenerate vertices
    for (var i = 0; i < r; i++) {
      vertices.push(precalculatedX[i]);
      vertices.push(0);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    for (var i = r - 1 ; i >= 0; i--) {
      vertices.push(precalculatedX[i]);
      vertices.push(0);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    // Add arc vertices
    var deltaLongitude = 1 / (l - 1);
    for (var j = 0; j < l; j++) {
      for (var i = 0; i < r; i++) {
        vertices.push(precalculatedX[i]);
        vertices.push(j * deltaLongitude);
        vertices.push(precalculatedZ[i]);
      }

      for (var i = r - 1; i >= 0; i--) {
        vertices.push(precalculatedX[i]);
        vertices.push(j * deltaLongitude);
        vertices.push(precalculatedZ[i] - t);
      }
    }

    // Add back face degenerate vertices
    for (var i = 0; i < r; i++) {
      vertices.push(precalculatedX[i]);
      vertices.push(1);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    for (var i = r - 1 ; i >= 0; i--) {
      vertices.push(precalculatedX[i]);
      vertices.push(1);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildClosedTriangularMeshIndices(2 * r, l + 2);
  };

  sg.geometries.Arc.prototype.draw = function(v, m) {
    this.context.shaders.basic.use();
    mat4.multiply(this.modelViewMatrix, v, m);
    this.context.shaders.basic.setModelViewMatrix(this.modelViewMatrix)

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
