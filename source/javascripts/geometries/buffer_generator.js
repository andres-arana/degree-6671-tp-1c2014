var sg = sg || {};
sg.geometries = sg.geometries || {};

(function() {
  sg.geometries.BufferGenerator = function(gl) {
    this.gl = gl;
  };

  sg.geometries.BufferGenerator.prototype.buildVertexBuffer = function(vertices) {
    var result = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, result);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW);

    result.items = vertices.length;
    return result;
  };

  sg.geometries.BufferGenerator.prototype.buildIndexBuffer = function(indices) {
    var result = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, result);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      this.gl.STATIC_DRAW);

    result.items = indices.length;
    return result;
  };

  sg.geometries.BufferGenerator.prototype.buildOpenTriangularMeshIndices = function (w, h) {
    var indices = [];
    for (var i = 0; i < h - 1; i++) {
      for (var j = 0; j < w; j++) {
        indices.push(i * w + j);
        indices.push((i + 1) * w + j);
      }

      indices.push((i + 2) * w - 1);
      indices.push((i + 1) * w);
    }

    return this.buildIndexBuffer(indices);
  };


  sg.geometries.BufferGenerator.prototype.buildClosedTriangularMeshIndices = function(w, h) {
    var indices = [];
    for (var i = 0; i < h - 1; i++) {
      for (var j = 0; j < w; j++) {
        indices.push(i * w + j);
        indices.push((i + 1) * w + j);
      }
      indices.push(i * w);
    }
    indices.push((h - 1) * w);

    return this.buildIndexBuffer(indices);
  };
})();
