var sg = sg || {};
sg.objects = sg.objects || {};

(function() {
  sg.objects.Water = function(context) {
    this.context = context;
    this.gl = context.gl;
    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();

    this.water = new sg.geometries.Water(context);

    this.waterAmbient = vec3.fromValues(0.3, 0.3, 0.45);
    this.waterDiffuse = vec3.fromValues(0.3, 0.3, 0.45);
    this.waterSpecular = vec3.fromValues(0.5, 0.5, 0.5);
    this.waterShininess = 500;

    this.phase = 0;

    this.bumpMap = new sg.textures.Diffuse(
      this.context,
      "bump-water",
      {repeat: true});

    this.reflection = new sg.textures.Render(
      this.context);
  };

  sg.objects.Water.prototype.draw = function(shader, v, m) {
    shader.setAmbient(this.waterAmbient);
    shader.setDiffuse(this.waterDiffuse);
    shader.setSpecular(this.waterSpecular);
    shader.setShininess(this.waterShininess);
    shader.setPhase(this.phase);
    shader.setBumpMap(this.bumpMap);
    shader.setReflection(this.reflection);

    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
    this.drawWater(this.water, shader, v, m);
    this.gl.disable(this.gl.BLEND);
  };

  sg.objects.Water.prototype.tick = function(delta) {
    this.phase += delta;
  };

  sg.objects.Water.prototype.useReflectionFramebuffer = function() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.reflection.frameBuffer);
    this.gl.viewport(0, 0, this.reflection.frameBuffer.width, this.reflection.frameBuffer.height);
    this.gl.clearColor(0.7, 0.7, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  };

  sg.objects.Water.prototype.clearReflectionFramebuffer = function() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  };

  sg.objects.Water.prototype.drawWater = function(obj, shader, v, m) {
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

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, obj.indexBuffer);
    this.gl.drawElements(
      this.gl.TRIANGLE_STRIP,
      obj.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  };

})();
