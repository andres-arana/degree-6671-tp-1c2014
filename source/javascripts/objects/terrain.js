var sg = sg || {};
sg.objects = sg.objects || {};

(function() {

  sg.objects.Terrain = function(context) {
    this.context = context
    this.gl = this.context.gl;

    this.water = new sg.geometries.Water(this.context, 6);

    this.waterAmbient = vec3.fromValues(0.25, 0.25, 0.4);
    this.waterDiffuse = vec3.fromValues(0.25, 0.25, 0.4);
    this.waterSpecular = vec3.fromValues(1, 1, 1);
    this.waterShininess = 500;

    this.terrain = new sg.geometries.Terrain(this.context);

    this.terrainAmbient = vec3.fromValues(0.1, 0.2, 0.05);
    this.terrainDiffuse = vec3.fromValues(0.3, 0.6, 0.15);
    this.terrainSpecular = vec3.fromValues(0, 0, 0);
    this.terrainShininess = 1;

    var grassImage = document.getElementById("texture-grass");
    this.grassTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.grassTexture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      grassImage);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR_MIPMAP_NEAREST);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT);

    this.gl.generateMipmap(this.gl.TEXTURE_2D);

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  };

  sg.objects.Terrain.prototype.draw = function(v, m) {
    this.context.shader.setUseTextures(true);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.grassTexture);
    this.context.shader.setTexture(0);
    this.context.shader.setSpecular(this.terrainSpecular);
    this.context.shader.setShininess(this.terrainShininess);
    this.terrain.draw(v, m);

    this.context.shader.setUseTextures(false);
    this.context.shader.setAmbient(this.waterAmbient);
    this.context.shader.setDiffuse(this.waterDiffuse);
    this.context.shader.setSpecular(this.waterSpecular);
    this.context.shader.setShininess(this.waterShininess);
    this.water.draw(v, m);
  };

})();
