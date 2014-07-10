var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  var WIDTH = 40;
  var HEIGHT = 40;

  sg.geometries.Water = function(context) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [];
    for (i = -WIDTH; i <= WIDTH; i++) {
      for (j = -HEIGHT; j <= HEIGHT; j++) {
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
    this.indexBuffer =  buffers.buildOpenTriangularMeshIndices(2 * WIDTH + 1, 2 * HEIGHT + 1);

    // Buffer descriptors
    this.recordLength = 56;
    this.positionOffset = 0;
    this.normalOffset = 12;
    this.tangentOffset = 24;
    this.bitangentOffset = 36;
    this.uvOffset = 48;
  };

})();
