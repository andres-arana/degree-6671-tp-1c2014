var sg = sg || {};
sg.objects = sg.objects || {};

(function() {
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
  };

  sg.objects.Track.prototype.draw = function(v, m) {
    this.context.shader.setAmbient(this.trackAmbient);
    this.context.shader.setDiffuse(this.trackDiffuse);
    this.context.shader.setSpecular(this.trackSpecular);
    this.context.shader.setShininess(this.trackShininess);

    this.innerTrack.draw(v, m);
    this.outerTrack.draw(v, m);

    this.context.shader.setAmbient(this.baseAmbient);
    this.context.shader.setDiffuse(this.baseDiffuse);
    this.context.shader.setSpecular(this.baseSpecular);
    this.context.shader.setShininess(this.baseShininess);

    this.base.draw(v, m);
  };

})();
