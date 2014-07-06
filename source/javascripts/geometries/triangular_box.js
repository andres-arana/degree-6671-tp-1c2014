var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.TriangularBox = function(context) {
    this.context= context;
    this.gl = context.gl;

    var vertices = [
      // Top face
      -1 , -1 , 1 , 0 , 0 , 1 , 1, 0, 0, 0, 1, 0, 0, 0,
       1 , -1 , 1 , 0 , 0 , 1 , 1, 0, 0, 0, 1, 0, 1, 0,
       1 ,  1 , 1 , 0 , 0 , 1 , 1, 0, 0, 0, 1, 0, 1, 1,
      -1 ,  1 , 1 , 0 , 0 , 1 , 1, 0, 0, 0, 1, 0, 0, 1,

      // Front face
      -1 , 1 , -1 , 0 , 1 , 0 , 1, 0, 0, 0, 0, 1, 0, 0,
      -1 , 1 ,  1 , 0 , 1 , 0 , 1, 0, 0, 0, 0, 1, 0, 1,
       1 , 1 ,  1 , 0 , 1 , 0 , 1, 0, 0, 0, 0, 1, 1, 1,
       1 , 1 , -1 , 0 , 1 , 0 , 1, 0, 0, 0, 0, 1, 1, 0,

      // Back face
      -1 ,  1 , -1 , 0 , -1 , -1 , 1, 0, 0, 0, 1, -1, 0, 0,
       1 ,  1 , -1 , 0 , -1 , -1 , 1, 0, 0, 0, 1, -1, 1, 0,
       1 , -1 ,  1 , 0 , -1 , -1 , 1, 0, 0, 0, 1, -1, 1, 1,
      -1 , -1 ,  1 , 0 , -1 , -1 , 1, 0, 0, 0, 1, -1, 0, 1,

      // Right face
      1 ,  1 , -1 , 1 , 0 , 0 , 0, 1, 0, 0, 0, 1, 1, 0,
      1 ,  1 ,  1 , 1 , 0 , 0 , 0, 1, 0, 0, 0, 1, 1, 1,
      1 , -1 ,  1 , 1 , 0 , 0 , 0, 1, 0, 0, 0, 1, 0, 1,

      // Left face
      -1 , -1 ,  1 , -1 , 0 , 0 , 0, 1, 0, 0, 0, 1, 0, 1,
      -1 ,  1 ,  1 , -1 , 0 , 0 , 0, 1, 0, 0, 0, 1, 1, 1,
      -1 ,  1 , -1 , -1 , 0 , 0 , 0, 1, 0, 0, 0, 1, 1, 0,
    ];

    var indices = [
      0, 1, 2,      0, 2, 3,    // Top face
      4, 5, 6,      4, 6, 7,    // Front face
      8, 9, 10,     8, 10, 11,  // Back face
      12, 14, 13,               // Right face
      15, 17, 16,               // Left face
    ];

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildIndexBuffer(indices);

    // Buffer descriptors
    this.recordLength = 56;
    this.positionOffset = 0;
    this.normalOffset = 12;
    this.tangentOffset = 24;
    this.bitangentOffset = 36;
    this.uvOffset = 48;
  };

})();
