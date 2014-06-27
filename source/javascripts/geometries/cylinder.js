var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Cylinder = function(context, r, l) {
    this.context = context;
    this.gl = context.gl;
    this.circle = new sg.paths.Circle(1);
    this.modelViewMatrix = mat4.create();

    vertices = [];
    for (var i = 0; i < r; i++) {
      vertices.push(0);
      vertices.push(0);
      vertices.push(0);
    }

    var deltaT = (this.circle.upperDomainBound() - this.circle.lowerDomainBound()) / r;
    var deltaL = 1 / (l - 1);
    for (var i = 0; i < l; i++) {
      for (var j = 0; j < r; j++) {
        var v = this.circle.evaluate(deltaT * j);
        vertices.push(v[0]);
        vertices.push(v[1]);
        vertices.push(deltaL * i);
      }
    }

    for (var i = 0; i < r; i++) {
      vertices.push(0);
      vertices.push(0);
      vertices.push(1);
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildClosedTriangularMeshIndices(r, l + 2);
  };

  sg.geometries.Cylinder.prototype.draw = function(v, m) {
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
