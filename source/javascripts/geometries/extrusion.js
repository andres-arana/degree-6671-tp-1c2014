var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Extrussion = function(context, curve, path, r, l) {
    this.context = context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();

    var vertices = [];

    var deltaT = (curve.upperDomainBound() - curve.lowerDomainBound()) / r;
    var deltaL = (path.upperDomainBound() - path.lowerDomainBound()) / l;

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

      var rotation = mat4.create();
      var rotation = mat4.rotateZ(rotation, rotation, angle);

      for (var j = 0; j <= r; j++) {
        var rawVertex = curve.evaluate(j * deltaT);
        var vertex = vec4.fromValues(rawVertex[0], 0, rawVertex[1], 1);
        vec4.transformMat4(vertex, vertex, transformation);

        vertices.push(vertex[0]);
        vertices.push(vertex[1]);
        vertices.push(vertex[2]);

        var rawCurveDerivative = curve.derivative(j * deltaT);
        var curveDerivative = vec3.fromValues(rawCurveDerivative[0], 0, rawCurveDerivative[1]);

        var tangent = vec3.transformMat4(vec3.create(), curveDerivative, rotation);

        var normal = vec3.cross(vec3.create(), tangent, projectionXY);
        vertices.push(normal[0]);
        vertices.push(normal[1]);
        vertices.push(normal[2]);

      }
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildOpenTriangularMeshIndices(r + 1, l + 1);
  };

  sg.geometries.Extrussion.prototype.draw = function(v, m) {
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
