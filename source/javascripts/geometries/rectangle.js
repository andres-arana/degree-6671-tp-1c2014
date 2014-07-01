var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Rectangle = function(context) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [
      -1 , 0 ,  1 , 0, 0,
      -1 , 0 , -1 , 0, 1,
       1 , 0 , -1 , 1, 1,
       1 , 0 ,  1 , 1, 0,
    ];

    var indices = [
      0, 1, 2,
      2, 0, 3,
    ];

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildIndexBuffer(indices);

    // Buffer descriptors
    this.recordLength = 20;
    this.positionOffset = 0;
    this.uvOffset = 12;
  };

})();
