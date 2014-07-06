var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Extrussion = function(context, curve, path, r, l) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [];

    var deltaT = (curve.upperDomainBound() - curve.lowerDomainBound()) / r;
    var deltaL = (path.upperDomainBound() - path.lowerDomainBound()) / l;
    var accumulatedDistance = 0;

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

      var previousLocation = path.evaluate(Math.cycle(
        (i - 1) * deltaL,
        path.lowerDomainBound(),
        path.upperDomainBound()));
      var distance = vec3.distance(location, previousLocation);
      accumulatedDistance += distance / 10;

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

        vertices.push(tangent[0]);
        vertices.push(tangent[1]);
        vertices.push(tangent[2]);

        vertices.push(projectionXY[0]);
        vertices.push(projectionXY[1]);
        vertices.push(projectionXY[2]);

        var uv = vec2.fromValues(j * deltaT, accumulatedDistance);
        vertices.push(uv[0]);
        vertices.push(uv[1]);
      }
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildOpenTriangularMeshIndices(r + 1, l + 1);

    // Buffer descriptors
    this.recordLength = 56;
    this.positionOffset = 0;
    this.normalOffset = 12;
    this.tangentOffset = 24;
    this.bitangentOffset = 36;
    this.uvOffset = 48;
  };

})();
