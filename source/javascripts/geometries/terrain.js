var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {
  var W = 200;
  var H = 200;

  function clampHorizontalIndex(index, def) {
    if (def % W == 0 && index < def) {
      return def;
    } else if (def % W == W - 1 && index > def) {
      return def
    } else {
      return index;
    }
  };

  function clampVerticalIndex(index, def) {
    if (index < 0) {
      return def;
    } else if (index > (W * H) - 1) {
      return def;
    } else {
      return index;
    }
  };


  sg.geometries.Terrain = function(context) {
    this.context = context;
    this.gl = context.gl;

    // Extract height data from image
    var heightmap = document.getElementById("heightmap");
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var canvasContext = canvas.getContext('2d');
    canvasContext.drawImage(heightmap, 0, 0);

    var size = W * H;
    var heightData = new Float32Array(size);

    var pixels = canvasContext.getImageData(
      0, 0,
      W, H).data;

    for (var i = 0, j = 0, len = pixels.length; i < len; i += 4, j++) {
      var total = pixels[i] + pixels[i + 1] + pixels[i + 2];
      heightData[j] = total / 30;
    }

    // Build triangle mesh
    var vertices = [];
    for (var i = 0; i < W; i++) {
      var x = (i * 100 / W) - 50;
      for (var j = 0; j < H; j++) {
        var y = (j * 100 / H) - 50;

        var currentIndex = i * H + j;

        var leftIndex = clampHorizontalIndex(i * H + j - 1, currentIndex);
        var rightIndex = clampHorizontalIndex(i * H + j + 1, currentIndex);
        var dfdx = (heightData[rightIndex] - heightData[leftIndex]) / 2;

        var topIndex = clampVerticalIndex((i - 1) * H + j, currentIndex);
        var botIndex = clampVerticalIndex((i + 1) * H + j, currentIndex);
        var dfdy = (heightData[botIndex] - heightData[topIndex]) / 2;

        // Vertex position
        var position = vec3.fromValues(x, y, heightData[currentIndex]);
        vertices.push(position[0]);
        vertices.push(position[1]);
        vertices.push(position[2]);

        // Vertex normal
        // (tg x bitg)
        var normal = vec3.fromValues(-dfdx, dfdy, 1);
        vec3.normalize(normal, normal);
        vertices.push(normal[0]);
        vertices.push(normal[1]);
        vertices.push(normal[2]);

        // Vertex texture coords
        // (x, y)
        var uv = vec2.fromValues((position[0] + 50) / 10, (position[1] + 50) / 10);
        vertices.push(uv[0]);
        vertices.push(uv[1]);
      }
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildOpenTriangularMeshIndices(W, H);

    // Buffer descriptors
    this.recordLength = 32;
    this.positionOffset = 0;
    this.normalOffset = 12;
    this.uvOffset = 24;
  };

})();
