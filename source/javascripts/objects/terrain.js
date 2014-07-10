var sg = sg || {};
sg.objects = sg.objects || {};

(function() {

  sg.objects.Terrain = function(context) {
    this.context = context
    this.gl = this.context.gl;

    this.terrain = new sg.geometries.Terrain(
      this.context,
      "terrain-big",
      2,
      200, 200);
    this.terrainTexture = new sg.textures.Diffuse(
      this.context,
      "texture-grass",
      {repeat: true});

    this.bump = new sg.textures.Diffuse(
      this.context,
      "bump-grass",
      {repeat: true});

    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();
  };

  sg.objects.Terrain.prototype.draw = function(shader, v, m) {
    shader.setTexture(this.terrainTexture);
    shader.setBumpMap(this.bump);

    this.drawTerrain(this.terrain, shader, v, m);
  };

  sg.objects.Terrain.prototype.drawTerrain = function(obj, shader, v, m) {
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
