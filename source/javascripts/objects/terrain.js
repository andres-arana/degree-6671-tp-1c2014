var sg = sg || {};
sg.objects = sg.objects || {};

(function() {

  sg.objects.Terrain = function(context, heightmap) {
    this.context = context

    this.terrain = new sg.geometries.Terrain(this.context, heightmap);
    this.water = new sg.geometries.Water(this.context, 6);

    this.modelMatrix = mat4.create();
    this.traslation = vec3.fromValues(0, 0, -20);
  };

  sg.objects.Terrain.prototype.draw = function(v, m) {
    mat4.translate(this.modelMatrix, m, this.traslation);
    this.context.shaders.basic.setColor(vec4.fromValues(0.4, 0.8, 0.2, 1.0));
    this.terrain.draw(v, this.modelMatrix);

    this.context.shaders.basic.setColor(vec4.fromValues(0.5, 0.5, 0.8, 0.5));
    this.water.draw(v, this.modelMatrix);
  };

})();
