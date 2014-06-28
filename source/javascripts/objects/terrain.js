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

    this.terrainTexture = new sg.textures.Diffuse(
      this.context,
      "texture-grass",
      {repeat: true});
  };

  sg.objects.Terrain.prototype.draw = function(v, m) {
    this.context.shader.setUseTextures(true);
    this.context.shader.setTexture(this.terrainTexture);
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
