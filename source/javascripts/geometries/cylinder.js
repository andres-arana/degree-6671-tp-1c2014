var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Cylinder = function(context, r, l) {
    this.context = context;
    this.gl = context.gl;
    this.circle = new sg.paths.Circle(1);

    vertices = [];
    for (var i = 0; i < r; i++) {
      vertices.push(0);
      vertices.push(0);
      vertices.push(0);

      vertices.push(0);
      vertices.push(0);
      vertices.push(-1);

      vertices.push(1);
      vertices.push(0);
      vertices.push(0);

      vertices.push(0);
      vertices.push(1);
      vertices.push(0);

      vertices.push(0.5);
      vertices.push(0.5);
    }

    var deltaT = (this.circle.upperDomainBound() - this.circle.lowerDomainBound()) / r;
    var deltaL = 1 / (l - 1);
    for (var i = 0; i < l; i++) {
      for (var j = 0; j < r; j++) {
        var v = this.circle.evaluate(deltaT * j);
        var d = this.circle.derivative(deltaT * j);
        vertices.push(v[0]);
        vertices.push(v[1]);
        vertices.push(deltaL * i);

        vertices.push(v[0]);
        vertices.push(v[1]);
        vertices.push(0);

        vertices.push(d[0]);
        vertices.push(d[1]);
        vertices.push(0);

        vertices.push(0);
        vertices.push(0);
        vertices.push(1);

        vertices.push(deltaT * j);
        vertices.push(deltaL * j);
      }
    }

    for (var i = 0; i < r; i++) {
      vertices.push(0);
      vertices.push(0);
      vertices.push(1);

      vertices.push(0);
      vertices.push(0);
      vertices.push(1);

      vertices.push(1);
      vertices.push(0);
      vertices.push(0);

      vertices.push(0);
      vertices.push(1);
      vertices.push(0);

      vertices.push(0.5);
      vertices.push(0.5);
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildClosedTriangularMeshIndices(r, l + 2);

    // Buffer descriptors
    this.recordLength = 56;
    this.positionOffset = 0;
    this.normalOffset = 12;
    this.tangentOffset = 24;
    this.bitangentOffset = 36;
    this.uvOffset = 48;
  };

})();
