var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {

  function buildVertexBuffer(gl, vertices) {
    var result = gl.createBuffer();
    result.items = vertices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, result);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.STATIC_DRAW);

    return result;
  };

  function buildIndexBuffer(gl, indices) {
    var result = gl.createBuffer();
    result.items = indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, result);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW);

    return result;
  };

  function buildOpenTriangularMeshIndices(gl, w, h) {
    var indices = [];
    for (var i = 0; i < h - 1; i++) {
      for (var j = 0; j < w; j++) {
        indices.push(i * w + j);
        indices.push((i + 1) * w + j);
      }

      indices.push((i + 2) * w - 1);
      indices.push((i + 1) * w);
    }

    return buildIndexBuffer(gl, indices);
  };


  sg.geometries.Terrain = function(context, heightmap) {
    var pictureWidth = 200;
    var pictureHeight = 200;

    this.context = context;
    this.gl = context.gl;

    // Extract height data from image
    var canvas = document.createElement('canvas');
    canvas.width = pictureWidth;
    canvas.height = pictureHeight;
    var canvasContext = canvas.getContext('2d');
    canvasContext.drawImage(heightmap, 0, 0);

    var size = pictureWidth * pictureHeight;
    var heightData = new Float32Array(size);

    var pixels = canvasContext.getImageData(
      0, 0,
      pictureWidth, pictureHeight).data;

    for (var i = 0, j = 0, len = pixels.length; i < len; i += 4, j++) {
      var total = pixels[i] + pixels[i + 1] + pixels[i + 2];
      heightData[j] = total / 30;
    }

    // Build triangle mesh
    var vertices = [];
    for (var i = 0; i < pictureWidth; i++) {
      var x = (i * 100 / pictureWidth) - 50;
      for (var j = 0; j < pictureHeight; j++) {
        var y = (j * 100 / pictureHeight) - 50;
        vertices.push(x);
        vertices.push(y);
        vertices.push(heightData[i * pictureHeight+ j]);
      }
    }

    // Build buffers
    this.vertexBuffer = buildVertexBuffer(this.gl, vertices);
    this.indexBuffer = buildOpenTriangularMeshIndices(
      this.gl, pictureWidth, pictureHeight);
  };

  sg.geometries.Terrain.prototype.draw = function(m) {
    this.context.shaders.basic.setModelMatrix(m);

    var attribute = this.context.shaders.basic.getPositionAttribute();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(attribute, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
