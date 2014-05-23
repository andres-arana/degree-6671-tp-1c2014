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

  function buildClosedTriangularMeshIndices(gl, w, h) {
    var indices = [];
    for (var i = 0; i < h - 1; i++) {
      for (var j = 0; j < w; j++) {
        indices.push(i * w + j);
        indices.push((i + 1) * w + j);
      }
      indices.push(i * w);
    }
    indices.push((h - 1) * w);

    return buildIndexBuffer(gl, indices);
  };

  function drawWithTriangleStrips(m) {
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

  function drawWithTriangles(m) {
    this.context.shaders.basic.setModelMatrix(m);

    var attribute = this.context.shaders.basic.getPositionAttribute();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.vertexAttribPointer(attribute, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      this.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

  vec3.angleBetween = function(v1, v2) {
    return Math.acos(vec3.dot(v1, v2));
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

  sg.geometries.Terrain.prototype.draw = drawWithTriangleStrips;

  sg.geometries.Water = function(context, level) {
    this.context = context;
    this.gl = context.gl;

    vertices = [
      -50, -50, level,
      50, -50, level,
      -50, 50, level,
      50, 50, level
    ];

    this.vertexBuffer = buildVertexBuffer(this.gl, vertices);

    indices = [
      0, 1, 2, 3
    ];

    this.indexBuffer =  buildIndexBuffer(this.gl, indices);
  };

  sg.geometries.Water.prototype.draw = drawWithTriangleStrips;

  sg.geometries.Cylinder = function(context, r, l) {
    this.context = context;
    this.gl = context.gl;
    this.circle = new sg.paths.Circle(1);

    vertices = [];
    for (var i = 0; i < r; i++) {
      vertices.push(0);
      vertices.push(0);
      vertices.push(0);
    }

    var deltaT = (this.circle.upperDomainBound() - this.circle.lowerDomainBound()) / r;
    var deltaL = 1 / (l - 1);
    for (var i = 0; i < l; i++) {
      for (var j = 0; j < r; j++) {
        var v = this.circle.evaluate(deltaT * j);
        vertices.push(v[0]);
        vertices.push(v[1]);
        vertices.push(deltaL * i);
      }
    }

    for (var i = 0; i < r; i++) {
      vertices.push(0);
      vertices.push(0);
      vertices.push(1);
    }

    // Build buffers
   this.vertexBuffer = buildVertexBuffer(this.gl, vertices);
   this.indexBuffer = buildClosedTriangularMeshIndices(
     this.gl, r, l + 2);
  };

  sg.geometries.Cylinder.prototype.draw = drawWithTriangleStrips;

  sg.geometries.Box = function(context) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
    ];

    this.vertexBuffer = buildVertexBuffer(this.gl, vertices);

    var indices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];
    this.indexBuffer = buildIndexBuffer(this.gl, indices);
  };

  sg.geometries.Box.prototype.draw = drawWithTriangles;

  sg.geometries.TriangularBox = function(context) {
    this.context= context;
    this.gl = context.gl;

    var vertices = [
      // Front face
      1, 1, 1,
      1, 1, -1,
      -1, 1, 1,
      -1, 1, -1,

      // Back face
      1, -1, 1,
      -1, -1 ,1
    ];

    this.vertexBuffer = buildVertexBuffer(this.gl, vertices);

    var indices = [
      0, 1, 2, 1, 3, 2, // Front face
      0, 4, 1, // Left face
      2, 3, 5, // Right face
      0, 2, 4, 4, 2, 5, // Top face
      1, 4, 5, 1, 5, 3, // Back face
    ];

    this.indexBuffer = buildIndexBuffer(this.gl, indices);
  };

  sg.geometries.TriangularBox.prototype.draw = drawWithTriangles;

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
    // Add front face degenerate vertices
    for (var i = 0; i < r; i++) {
      vertices.push(precalculatedX[i]);
      vertices.push(0);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    for (var i = r - 1 ; i >= 0; i--) {
      vertices.push(precalculatedX[i]);
      vertices.push(0);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    // Add arc vertices
    var deltaLongitude = 1 / (l - 1);
    for (var j = 0; j < l; j++) {
      for (var i = 0; i < r; i++) {
        vertices.push(precalculatedX[i]);
        vertices.push(j * deltaLongitude);
        vertices.push(precalculatedZ[i]);
      }

      for (var i = r - 1; i >= 0; i--) {
        vertices.push(precalculatedX[i]);
        vertices.push(j * deltaLongitude);
        vertices.push(precalculatedZ[i] - t);
      }
    }

    // Add back face degenerate vertices
    for (var i = 0; i < r; i++) {
      vertices.push(precalculatedX[i]);
      vertices.push(1);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    for (var i = r - 1 ; i >= 0; i--) {
      vertices.push(precalculatedX[i]);
      vertices.push(1);
      vertices.push(precalculatedZ[i] - t / 2);
    }

    this.vertexBuffer = buildVertexBuffer(this.gl, vertices);

    this.indexBuffer = buildClosedTriangularMeshIndices(this.gl, 2 * r, l + 2);
  };

  sg.geometries.Arc.prototype.draw = drawWithTriangleStrips;

  sg.geometries.Extrussion = function(context, curve, path, r, l) {
    this.context = context;
    this.gl = context.gl;

    var vertices = [];

    var deltaT = (curve.upperDomainBound() - curve.lowerDomainBound()) / r;
    var deltaL = (path.upperDomainBound() - path.lowerDomainBound()) / l;

    var curveNormal = vec3.fromValues(0, 0, 1);

    for (var i = 0; i <= l; i++) {
      var location = path.evaluate(i * deltaL);
      var derivative = vec3.normalize(
        vec3.create(),
        path.derivative(i * deltaL));

      var projectionXY = vec3.fromValues(derivative[0], derivative[1], 0);
      vec3.normalize(projectionXY, projectionXY);
      var direction = derivative[0] > 0 ? -1 : 1;
      var rawAngle = vec3.angleBetween(projectionXY, vec3.fromValues(0, 1, 0));
      var angle = direction * rawAngle;

      var transformation = mat4.create();
      mat4.translate(transformation, transformation, location);
      mat4.rotateZ(transformation, transformation, angle);

      for (var j = 0; j <= r; j++) {
        var rawVertex = curve.evaluate(j * deltaT);
        var vertex = vec4.fromValues(rawVertex[0], 0, rawVertex[1], 1);
        vec4.transformMat4(vertex, vertex, transformation);

        vertices.push(vertex[0]);
        vertices.push(vertex[1]);
        vertices.push(vertex[2]);
      }
    }

    this.vertexBuffer = buildVertexBuffer(this.gl, vertices);

    this.indexBuffer = buildOpenTriangularMeshIndices(this.gl, r + 1, l + 1);
  };

  sg.geometries.Extrussion.prototype.draw = drawWithTriangleStrips;

})();
