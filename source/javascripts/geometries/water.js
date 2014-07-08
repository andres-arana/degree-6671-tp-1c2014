var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Water = function(context) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [];
    for (i = -50; i <= 50; i++) {
      for (j = -50; j <= 50; j++) {
        vertices.push(i);
        vertices.push(j);
        vertices.push(0);

        vertices.push(0);
        vertices.push(0);
        vertices.push(1);

        vertices.push(0);
        vertices.push(1);
        vertices.push(0);

        vertices.push(0);
        vertices.push(0);
        vertices.push(1);

        vertices.push(i / 10);
        vertices.push(j / 10);
      };
    }

    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer =  buffers.buildOpenTriangularMeshIndices(101, 101);

    // Buffer descriptors
    this.recordLength = 56;
    this.positionOffset = 0;
    this.normalOffset = 12;
    this.tangentOffset = 24;
    this.bitangentOffset = 36;
    this.uvOffset = 48;
  };

})();
