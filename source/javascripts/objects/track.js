var sg = sg || {};
sg.objects = sg.objects || {};

(function() {
  sg.objects.Track = function(context) {
    this.context = context;
    this.gl = this.context.gl;

    var trackProfile = new sg.paths.BSpline(vec2, [
      vec3.fromValues(-0.1, 0),
      vec3.fromValues(-0.1, 0.2),
      vec3.fromValues(-0.3, 0.2),
      vec3.fromValues(-0.3, 0.3),
      vec3.fromValues(0, 0.3),
      vec3.fromValues(0.3, 0.3),
      vec3.fromValues(0.3, 0.2),
      vec3.fromValues(0.1, 0.2),
      vec3.fromValues(0.1, 0),
      vec3.fromValues(0.1, -0.2),
      vec3.fromValues(0.3, -0.2),
      vec3.fromValues(0.3, -0.3),
      vec3.fromValues(0, -0.3),
      vec3.fromValues(-0.3, -0.3),
      vec3.fromValues(-0.3, -0.2),
      vec3.fromValues(-0.1, -0.2),
      vec3.fromValues(-0.1, 0),
      vec3.fromValues(-0.1, 0.2),
    ]);

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

    var innerScale = 29/30;
    var innerTransform = mat4.scale(
      mat4.create(),
      mat4.create(),
      vec3.fromValues(innerScale, innerScale, 1));

    this.innerTrack = new sg.geometries.Extrussion(
      this.context,
      trackProfile,
      this.path.transform(innerTransform),
      32, 128);

    var outerScale = 31/30;
    var outerTransform = mat4.scale(
      mat4.create(),
      mat4.create(),
      vec3.fromValues(outerScale, outerScale, 1));

    this.outerTrack = new sg.geometries.Extrussion(
      this.context,
      trackProfile,
      this.path.transform(outerTransform),
      32, 128);

    var baseProfile = new sg.paths.Bezier(vec2,
      vec2.fromValues(-4, 0),
      vec2.fromValues(-2.75, 3),
      vec2.fromValues(2.75, 3),
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

    this.baseAmbient = vec3.fromValues(0.4, 0.4, 0.25);
    this.baseDiffuse = vec3.fromValues(0.4, 0.4, 0.25);
    this.baseSpecular = vec3.fromValues(0, 0, 0);
    this.baseShininess = 1;

    this.trackAmbient = vec3.fromValues(0.25, 0.25, 0.4);
    this.trackDiffuse = vec3.fromValues(0.25, 0.25, 0.4);
    this.trackSpecular = vec3.fromValues(0.25, 0.25, 0.4);
    this.trackShininess = 500;

    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();
  };

  sg.objects.Track.prototype.draw = function(shader, v, m) {
    shader.setAmbient(this.trackAmbient);
    shader.setDiffuse(this.trackDiffuse);
    shader.setSpecular(this.trackSpecular);
    shader.setShininess(this.trackShininess);

    this.drawExtrusion(this.innerTrack, shader, v, m);
    this.drawExtrusion(this.outerTrack, shader, v, m);

    shader.setAmbient(this.baseAmbient);
    shader.setDiffuse(this.baseDiffuse);
    shader.setSpecular(this.baseSpecular);
    shader.setShininess(this.baseShininess);

    this.drawExtrusion(this.base, shader, v, m);
  };

  sg.objects.Track.prototype.drawExtrusion = function(obj, shader, v, m) {
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

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      obj.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
