var sg = sg || {};
sg.objects = sg.objects || {};

sg.objects.Triangle = function(context) {
  this.context = context;
  this.gl = context.gl;

  var vertices = [
    -1, 1, 0,
    1, 1, 0,
    -1, -1, 0,
  ];

  this.vertexBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
  this.gl.bufferData(
    this.gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    this.gl.STATIC_DRAW);

  var indices = [
    0, 2, 1
  ];

  this.indicesBuffer = this.gl.createBuffer();
  this.indicesBuffer.items = indices.length;
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
  this.gl.bufferData(
    this.gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    this.gl.STATIC_DRAW);
};

sg.objects.Triangle.prototype.draw = function(m) {
  this.context.shaders.basic.setModelMatrix(m);

  var attribute = this.context.shaders.basic.getPositionAttribute();

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
  this.gl.vertexAttribPointer(attribute, 3, this.gl.FLOAT, false, 0, 0);

  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
  this.gl.drawElements(this.gl.TRIANGLE_STRIP, this.indicesBuffer.items, this.gl.UNSIGNED_SHORT, 0);
};
