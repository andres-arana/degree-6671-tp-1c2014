var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  var W = 200;
  var H = 200;

  function clampIndex(index, min, max) {
    if (index < min) {
      return min;
    } else if (index > max) {
      return max;
    } else {
      return index;
    }
  };

  function clampIndexWithDefault(index, min, max, def) {
    if (index < min) {
      return def;
    } else if (index > max) {
      return def;
    } else {
      return index;
    }
  };


  sg.geometries.Terrain = function(context, heightmap) {
    this.context = context;
    this.gl = context.gl;

    // Extract height data from image
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

        var leftIndex = clampIndex(i * H + j - 1, 0, size - 1);
        var rightIndex = clampIndex(i * H + j + 1, 0, size - 1);
        var dfdx = (heightData[rightIndex] - heightData[leftIndex]) / 2;

        var topIndex = clampIndexWithDefault((i - 1) * H + j, 0, size - 1, currentIndex);
        var botIndex = clampIndexWithDefault((i + 1) * H + j, 0, size - 1, currentIndex);
        var dfdy = (heightData[botIndex] - heightData[topIndex]) / 2;

        // Vertex position
        vertices.push(x);
        vertices.push(y);
        vertices.push(heightData[currentIndex]);

        // Vertex normal
        // (tg x bitg)
        var normal = vec3.fromValues(-dfdx, dfdy, 1);
        vec3.normalize(normal, normal);
        vertices.push(normal[0]);
        vertices.push(normal[1]);
        vertices.push(normal[2]);

        // Vertex tg
        // (1, 0, dfdx)
        var tg = vec3.fromValues(1, 0, dfdx);
        vec3.normalize(tg, tg);
        vertices.push(tg[0]);
        vertices.push(tg[1]);
        vertices.push(tg[2]);

        // Vertex bitg
        // (0, 1, dfdy)
        var bitg = vec3.fromValues(0, 1, dfdy);
        vec3.normalize(bitg, bitg);
        vertices.push(bitg[0]);
        vertices.push(bitg[1]);
        vertices.push(bitg[2]);
      }
    }

    // Build buffers
    var buffers = new sg.geometries.BufferGenerator(this.gl);
    this.vertexBuffer = buffers.buildVertexBuffer(vertices);
    this.indexBuffer = buffers.buildOpenTriangularMeshIndices(W, H);
  };

  sg.geometries.Terrain.prototype.draw = function(v, m) {
    this.context.shaders.basic.use();
    var modelViewMatrix = mat4.create();
    mat4.multiply(modelViewMatrix, v, m);
    this.context.shaders.basic.setModelViewMatrix(modelViewMatrix)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

    var positionAttribute = this.context.shaders.basic.getPositionAttribute();
    this.gl.vertexAttribPointer(positionAttribute, 3, this.gl.FLOAT, false, 48, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };
})();
