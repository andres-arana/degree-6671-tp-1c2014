var sg = sg || {};
sg.objects = sg.objects || {};

(function() {
  sg.objects.TrackBase = function(context) {
    this.context = context;
    this.gl = this.context.gl;
    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();

    this.path = new sg.paths.BSpline(vec3, [
      vec3.fromValues(40, -20, 1),
      vec3.fromValues(20, 35, 1),
      vec3.fromValues(0, 30, 1),
      vec3.fromValues(-20, 25, 1),
      vec3.fromValues(-30, 0, 1),
      vec3.fromValues(-40, -20, 1),
      vec3.fromValues(-30, -46, 1),
      vec3.fromValues(10, -30, 1),
      vec3.fromValues(40, -20, 1),
      vec3.fromValues(20, 35, 1),
    ]);

    var baseProfile = new sg.paths.Bezier(vec2,
      vec2.fromValues(-4, 0),
      vec2.fromValues(-3.95, 3),
      vec2.fromValues(3.95, 3),
      vec2.fromValues(4, 0));

    var baseTransform = mat4.translate(
      mat4.create(),
      mat4.create(),
      vec3.fromValues(0, 0, -2.5));

    this.base = new sg.geometries.Extrussion(
      this.context,
      baseProfile,
      this.path.transform(baseTransform),
      16, 128);

    this.baseSpecular = vec3.fromValues(0, 0, 0);
    this.baseShininess = 1;
    this.baseTexture = new sg.textures.Diffuse(
      this.context,
      "texture-train-base",
      {repeat: true});
  };

  sg.objects.TrackBase.prototype.draw = function(shader, v, m) {
    shader.setTexture(this.baseTexture);
    shader.setSpecular(this.baseSpecular);
    shader.setShininess(this.baseShininess);

    this.drawExtrusion(this.base, shader, v, m);
  };

  sg.objects.TrackBase.prototype.drawExtrusion = function(obj, shader, v, m) {
    mat4.multiply(this.modelViewMatrix, v, m);
    shader.setModelViewMatrix(this.modelViewMatrix)

    mat3.normalFromMat4(this.normalMatrix, this.modelViewMatrix);
    shader.setNormalMatrix(this.normalMatrix);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, obj.vertexBuffer);

    var position = shader.getPositionAttribute();
    this.gl.vertexAttribPointer(
      position,
      3,
      this.gl.FLOAT,
      false,
      obj.recordLength,
      obj.positionOffset);

    var normal = shader.getNormalAttribute();
    this.gl.vertexAttribPointer(
      normal,
      3,
      this.gl.FLOAT,
      false,
      obj.recordLength,
      obj.normalOffset);

    var uv = shader.getTexCoordsAttribute();
    this.gl.vertexAttribPointer(
      uv,
      2,
      this.gl.FLOAT,
      false,
      obj.recordLength,
      obj.uvOffset);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      obj.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
