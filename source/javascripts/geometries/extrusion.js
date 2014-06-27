var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Extrussion = function(context, curve, path, r, l) {
    this.context = context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();

    var vertices = [];

    var deltaT = (curve.upperDomainBound() - curve.lowerDomainBound()) / r;
    var deltaL = (path.upperDomainBound() - path.lowerDomainBound()) / l;

    var curveNormal = vec3.fromValues(0, 0, 1);

    for (var i = 0; i <= l; i++) {
      var location = path.evaluate(i * deltaL);
      var derivative = vec3.normalize(
        vec3.create(),
        path.derivative(i * deltaL));

      var projectionXY = vec3.fromValues(derivative[0], derivative[1], 0);
      vec3.normalize(projectionXY, projectionXY);
      var direction = derivative[0] > 0 ? -1 : 1;
      var rawAngle = vec3.angleBetween(projectionXY, vec3.fromValues(0, 1, 0));
      var angle = direction * rawAngle;

      var transformation = mat4.create();
      mat4.translate(transformation, transformation, location);
      mat4.rotateZ(transformation, transformation, angle);

      for (var j = 0; j <= r; j++) {
        var rawVertex = curve.evaluate(j * deltaT);
        var vertex = vec4.fromValues(rawVertex[0], 0, rawVertex[1], 1);
        vec4.transformMat4(vertex, vertex, transformation);

        vertices.push(vertex[0]);
        vertices.push(vertex[1]);
        vertices.push(vertex[2]);
      }
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildOpenTriangularMeshIndices(r + 1, l + 1);
  };

  sg.geometries.Extrussion.prototype.draw = function(v, m) {
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
