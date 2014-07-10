var sg = sg || {};
sg.objects = sg.objects || {};

(function() {
  sg.objects.Track = function(context) {
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

    this.trackAmbient = vec3.fromValues(0.25, 0.25, 0.4);
    this.trackDiffuse = vec3.fromValues(0.25, 0.25, 0.4);
    this.trackSpecular = vec3.fromValues(0.25, 0.25, 0.4);
    this.trackShininess = 500;

    this.bump = new sg.textures.Diffuse(
      this.context,
      "bump-metal",
      {repeat: true});
  };

  sg.objects.Track.prototype.draw = function(shader, v, m) {
    shader.setAmbient(this.trackAmbient);
    shader.setDiffuse(this.trackDiffuse);
    shader.setSpecular(this.trackSpecular);
    shader.setShininess(this.trackShininess);
    shader.setBumpMap(this.bump);

    this.drawExtrusion(this.innerTrack, shader, v, m);
    this.drawExtrusion(this.outerTrack, shader, v, m);
  };

  sg.objects.Track.prototype.drawExtrusion = function(obj, shader, v, m) {
    mat4.multiply(this.modelViewMatrix, v, m);
    shader.setModelMatrix(m);
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

    var tangent = shader.getTangentAttribute();
    this.gl.vertexAttribPointer(
      tangent,
      3,
      this.gl.FLOAT,
      false,
      obj.recordLength,
      obj.tangentOffset);

    var bitangent = shader.getBitangentAttribute();
    this.gl.vertexAttribPointer(
      bitangent,
      3,
      this.gl.FLOAT,
      false,
      obj.recordLength,
      obj.bitangentOffset);

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
