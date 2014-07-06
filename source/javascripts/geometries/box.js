var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  sg.geometries.Box = function(context) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [
      // Front face
      -1 , -1 , 1 , 0 , 0 , 1 , 1, 0 ,0, 0, 1, 0, 0, 0,
       1 , -1 , 1 , 0 , 0 , 1 , 1, 0 ,0, 0, 1, 0, 1, 0,
       1 ,  1 , 1 , 0 , 0 , 1 , 1, 0 ,0, 0, 1, 0, 1, 1,
      -1 ,  1 , 1 , 0 , 0 , 1 , 1, 0 ,0, 0, 1, 0, 0, 1,

      // Back face
      -1 , -1 , -1 , 0 , 0 , -1 , 1, 0 ,0, 0, 1, 0, 0, 0,
      -1 ,  1 , -1 , 0 , 0 , -1 , 1, 0 ,0, 0, 1, 0, 0, 1,
       1 ,  1 , -1 , 0 , 0 , -1 , 1, 0 ,0, 0, 1, 0, 1, 1,
       1 , -1 , -1 , 0 , 0 , -1 , 1, 0 ,0, 0, 1, 0, 1, 0,

      // Top face
      -1 , 1 , -1 , 0 , 1 , 0 , 1, 0 ,0, 0, 0, 1, 0, 0,
      -1 , 1 ,  1 , 0 , 1 , 0 , 1, 0 ,0, 0, 0, 1, 0, 1,
       1 , 1 ,  1 , 0 , 1 , 0 , 1, 0 ,0, 0, 0, 1, 1, 1,
       1 , 1 , -1 , 0 , 1 , 0 , 1, 0 ,0, 0, 0, 1, 1, 0,

      // Bottom face
      -1 , -1 , -1 , 0 , -1 , 0 , 1, 0 ,0, 0, 0, 1, 0, 0,
       1 , -1 , -1 , 0 , -1 , 0 , 1, 0 ,0, 0, 0, 1, 1, 0,
       1 , -1 ,  1 , 0 , -1 , 0 , 1, 0 ,0, 0, 0, 1, 1, 1,
      -1 , -1 ,  1 , 0 , -1 , 0 , 1, 0 ,0, 0, 0, 1, 0, 1,

      // Right face
      1 , -1 , -1 , 1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 0, 0,
      1 ,  1 , -1 , 1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 1, 0,
      1 ,  1 ,  1 , 1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 1, 1,
      1 , -1 ,  1 , 1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 0, 1,

      // Left face
      -1 , -1 , -1 , -1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 0, 0,
      -1 , -1 ,  1 , -1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 0, 1,
      -1 ,  1 ,  1 , -1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 1, 1,
      -1 ,  1 , -1 , -1 , 0 , 0 , 0, 1 ,0, 0, 0, 1, 1, 0,
    ];

    var indices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
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
