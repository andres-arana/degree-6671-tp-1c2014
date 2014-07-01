var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Arc = function(context, r, l, t) {
    this.context = context;
    this.gl = context.gl;

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

    // Buffer descriptors
    this.recordLength = 24;
    this.positionOffset = 0;
    this.normalOffset = 12;
  };

})();
