var sg = sg || {};
sg.objects = sg.objects || {};

(function() {

  sg.objects.Terrain = function(context, heightmap) {
    this.context = context

    this.terrain = new sg.geometries.Terrain(this.context, heightmap);
    this.water = new sg.geometries.Water(this.context, 6);
  };

  sg.objects.Terrain.prototype.draw = function(m) {
    var modelMatrix = mat4.clone(m);
    mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 0, -20));
    this.context.shaders.basic.setColor(vec4.fromValues(0.4, 0.8, 0.2, 1.0));
    this.terrain.draw(modelMatrix);

    this.context.shaders.basic.setColor(vec4.fromValues(0.5, 0.5, 0.8, 0.5));
    this.water.draw(modelMatrix);
  };

  sg.objects.Train = function(context) {
    this.context = context;

    this.cylinder = new sg.geometries.Cylinder(this.context, 24, 4);
    this.box = new sg.geometries.Box(this.context);
    this.arc = new sg.geometries.Arc(this.context, 24, 4, 0.5);
    this.triangular = new sg.geometries.TriangularBox(this.context);
  };

  sg.objects.Train.prototype.draw = function(m) {
    var modelMatrix = mat4.clone(m);

    this.context.shaders.basic.setColor(vec4.fromValues(0.8, 0.2, 0.2, 1.0));

    // Draw the engine container
    var m1 = mat4.clone(modelMatrix);
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(5, 5, 5));
    this.cylinder.draw(m1);

    // Draw the engine top
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(5, 0, 0));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(6, 6, 2));
    this.cylinder.draw(m1);

    // Draw the chimmey
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(6, 0, 5))
    mat4.scale(m1, m1, vec3.fromValues(1, 1, 5));
    this.cylinder.draw(m1);

    // Draw both pistons holders
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(7, 4, -8));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 3));
    this.cylinder.draw(m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(7, -4, -8));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 3));
    this.cylinder.draw(m1);

    // Draw engine top securer
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(7, 0, 0));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(1, 1, 1.5));
    this.cylinder.draw(m1);

    // Draw the engine support
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-2, 0, -5));
    mat4.scale(m1, m1, vec3.fromValues(9, 6, 0.25));
    this.box.draw(m1);

    // Draw the cockpit
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-5, 0, 0));
    mat4.scale(m1, m1, vec3.fromValues(5, 5.75, 5));
    this.box.draw(m1);

    // Draw the cockpit support
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-6, 0, -2));
    mat4.scale(m1, m1, vec3.fromValues(6, 6, 3));
    this.box.draw(m1);

    // Draw the bottom part
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-10, 0, -7.5));
    mat4.scale(m1, m1, vec3.fromValues(2, 6, 2.5));
    this.box.draw(m1);

    // Draw the piston protection
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-6, 0, -7.5));
    mat4.scale(m1, m1, vec3.fromValues(2, 6, 2.5));
    mat4.rotateZ(m1, m1, Math.PI / 2);
    this.triangular.draw(m1);

    // Draw the roof support
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, 5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, -5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-9.75, 5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-9.75, -5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(m1);

    // Draw the roof sustainer
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, 0, 12));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 5.75, 0.25));
    this.box.draw(m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-9.75, 0, 12));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 5.75, 0.25));
    this.box.draw(m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-5, 5.5, 12));
    mat4.scale(m1, m1, vec3.fromValues(5, 0.25, 0.25));
    this.box.draw(m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-5, -5.5, 12));
    mat4.scale(m1, m1, vec3.fromValues(5, 0.25, 0.25));
    this.box.draw(m1);

    // Draw the roof
    this.context.shaders.basic.setColor(vec4.fromValues(0.8, 0.8, 0.2, 1.0));
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, 0, 12.5));
    mat4.rotateZ(m1, m1, Math.PI / 2);
    mat4.scale(m1, m1, vec3.fromValues(6, 10, 2));
    this.arc.draw(m1);

    // Draw the wheels
    this.context.shaders.basic.setColor(vec4.fromValues(0.3, 0.3, 0.3, 1.0));
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(3, 5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-3, 5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(3, -3.5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-3, -3.5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(m1);

    // Draw the pistons
    this.context.shaders.basic.setColor(vec4.fromValues(0.5, 0.5, 0.6, 1.0));
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(1, 5.25, -8.5));
    mat4.scale(m1, m1, vec3.fromValues(6, 0.25, 0.5));
    this.box.draw(m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, -5.25, -8.5));
    mat4.scale(m1, m1, vec3.fromValues(6, 0.25, 0.5));
    this.box.draw(m1);
  };

  sg.objects.Track = function(context) {
    this.context = context;

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
      32, 64);

    var outerScale = 31/30;
    var outerTransform = mat4.scale(
      mat4.create(),
      mat4.create(),
      vec3.fromValues(outerScale, outerScale, 1));

    this.outerTrack = new sg.geometries.Extrussion(
      this.context,
      trackProfile,
      this.path.transform(outerTransform),
      32, 64);

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
  };

  sg.objects.Track.prototype.draw = function(m) {
    this.context.shaders.basic.setColor(vec4.fromValues(0.5, 0.5, 0.8, 1));
    this.innerTrack.draw(m);
    this.outerTrack.draw(m);

    this.context.shaders.basic.setColor(vec4.fromValues(0.8, 0.8, 0.5, 1));
    this.base.draw(m);
  };


})();
