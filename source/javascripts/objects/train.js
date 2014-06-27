var sg = sg || {};
sg.objects = sg.objects || {};

(function() {
  sg.objects.Train = function(context, track) {
    this.context = context;
    this.track = track;

    this.positionTick = 0;
    this.positionDirty = true;

    this.derivativeDirty = true;

    this.pistonPosition = 0;
    this.pistonDirection = 1;

    this.cylinder = new sg.geometries.Cylinder(this.context, 24, 4);
    this.box = new sg.geometries.Box(this.context);
    this.arc = new sg.geometries.Arc(this.context, 24, 4, 0.5);
    this.triangular = new sg.geometries.TriangularBox(this.context);

    this.bodyAmbient = vec3.fromValues(0.4, 0.1, 0.1);
    this.bodyDiffuse = vec3.fromValues(0.4, 0.1, 0.1);
    this.bodySpecular = vec3.fromValues(0.1, 0.1, 0.1);
    this.bodyShininess = 100;

    this.roofAmbient = vec3.fromValues(0.4, 0.4, 0.1);
    this.roofDiffuse = vec3.fromValues(0.4, 0.4, 0.1);
    this.roofSpecular = vec3.fromValues(0, 0, 0);
    this.roofShininess = 1;

    this.wheelsAmbient = vec3.fromValues(0.15, 0.15, 0.15);
    this.wheelsDiffuse = vec3.fromValues(0.15, 0.15, 0.15);
    this.wheelsSpecular = vec3.fromValues(0, 0, 0);
    this.wheelsShininess = 1;

    this.pistonAmbient = vec3.fromValues(0.25, 0.25, 0.3);
    this.pistonDiffuse = vec3.fromValues(0.25, 0.25, 0.3);
    this.pistonSpecular = vec3.fromValues(1, 1, 1);
    this.pistonShininess = 100;
  };

  sg.objects.Train.prototype.currentPosition = function() {
    if (this.positionDirty) {
      this.positionDirty = false;
      this.position = this.track.path.evaluate(this.positionTick);
    }
    return this.position;
  };

  sg.objects.Train.prototype.currentDerivative = function() {
    if (this.derivativeDirty) {
      this.derivativeDirty = false;
      this.derivative = this.track.path.derivative(this.positionTick);
    }
    return this.derivative;
  };

  sg.objects.Train.prototype.draw = function(v, m) {
    var modelMatrix = mat4.clone(m);

    var trainPosition = this.currentPosition();
    var derivative = this.currentDerivative();

    var projection = vec3.fromValues(derivative[0], derivative[1], 0);
    vec3.normalize(projection, projection);
    var direction = derivative[0] > 0 ? -1 : 1;
    var rawAngle = vec3.angleBetween(projection, vec3.fromValues(0, 1, 0));
    var angle = (direction * rawAngle) + Math.PI / 2;

    vec3.subtract(trainPosition, trainPosition, vec3.fromValues(0, 0, 9.4));
    mat4.translate(modelMatrix, modelMatrix, trainPosition);
    mat4.rotateZ(modelMatrix, modelMatrix, angle);
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.2, 0.2, 0.2));

    this.context.shader.setUseTextures(false);
    this.context.shader.setAmbient(this.bodyAmbient);
    this.context.shader.setDiffuse(this.bodyDiffuse);
    this.context.shader.setSpecular(this.bodySpecular);
    this.context.shader.setShininess(this.bodyShininess);

    // Draw the engine container
    var m1 = mat4.clone(modelMatrix);
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(5, 5, 5));
    this.cylinder.draw(v, m1);

    // Draw the engine top
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(5, 0, 0));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(6, 6, 2));
    this.cylinder.draw(v, m1);

    // Draw the chimmey
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(6, 0, 5))
    mat4.scale(m1, m1, vec3.fromValues(1, 1, 5));
    this.cylinder.draw(v, m1);

    // Draw both pistons holders
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(7, 4, -8));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 3));
    this.cylinder.draw(v, m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(7, -4, -8));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 3));
    this.cylinder.draw(v, m1);

    // Draw engine top securer
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(7, 0, 0));
    mat4.rotateY(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(1, 1, 1.5));
    this.cylinder.draw(v, m1);

    // Draw the engine support
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-2, 0, -5));
    mat4.scale(m1, m1, vec3.fromValues(8.75, 6, 0.25));
    this.box.draw(v, m1);

    // Draw the cockpit
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-5, 0, 0));
    mat4.scale(m1, m1, vec3.fromValues(5, 5.75, 5));
    this.box.draw(v, m1);

    // Draw the cockpit support
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-6, 0, -2));
    mat4.scale(m1, m1, vec3.fromValues(6, 6, 3));
    this.box.draw(v, m1);

    // Draw the bottom part
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-10, 0, -7.5));
    mat4.scale(m1, m1, vec3.fromValues(2, 6, 2.5));
    this.box.draw(v, m1);

    // Draw the piston protection
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-6, 0, -7.5));
    mat4.scale(m1, m1, vec3.fromValues(2, 6, 2.5));
    mat4.rotateZ(m1, m1, Math.PI / 2);
    this.triangular.draw(v, m1);

    // Draw the roof support
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, 5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(v, m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, -5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(v, m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-9.75, 5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(v, m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-9.75, -5.5, 6));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 0.25, 6));
    this.box.draw(v, m1);

    // Draw the roof sustainer
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, 0, 12));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 5.75, 0.25));
    this.box.draw(v, m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-9.75, 0, 12));
    mat4.scale(m1, m1, vec3.fromValues(0.25, 5.75, 0.25));
    this.box.draw(v, m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-5, 5.5, 12));
    mat4.scale(m1, m1, vec3.fromValues(5, 0.25, 0.25));
    this.box.draw(v, m1);
    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-5, -5.5, 12));
    mat4.scale(m1, m1, vec3.fromValues(5, 0.25, 0.25));
    this.box.draw(v, m1);

    // Draw the roof
    this.context.shader.setUseTextures(false);
    this.context.shader.setAmbient(this.roofAmbient);
    this.context.shader.setDiffuse(this.roofDiffuse);
    this.context.shader.setSpecular(this.roofSpecular);
    this.context.shader.setShininess(this.roofShininess);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(0, 0, 12.0));
    mat4.rotateZ(m1, m1, Math.PI / 2);
    mat4.scale(m1, m1, vec3.fromValues(6, 10, 2));
    this.arc.draw(v, m1);

    // Draw the wheels
    this.context.shader.setUseTextures(false);
    this.context.shader.setAmbient(this.wheelsAmbient);
    this.context.shader.setDiffuse(this.wheelsDiffuse);
    this.context.shader.setSpecular(this.wheelsSpecular);
    this.context.shader.setShininess(this.wheelsShininess);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(3, 5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(v, m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-3, 5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(v, m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(3, -3.5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(v, m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(-3, -3.5, -8.5));
    mat4.rotateX(m1, m1, Math.PI/2);
    mat4.scale(m1, m1, vec3.fromValues(3, 3, 1.5));
    this.cylinder.draw(v, m1);

    // Draw the pistons
    this.context.shader.setUseTextures(false);
    this.context.shader.setAmbient(this.pistonAmbient);
    this.context.shader.setDiffuse(this.pistonDiffuse);
    this.context.shader.setSpecular(this.pistonSpecular);
    this.context.shader.setShininess(this.pistonShininess);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(1 + 2 * this.pistonPosition, 5.25, -8.5));
    mat4.scale(m1, m1, vec3.fromValues(6, 0.25, 0.5));
    this.box.draw(v, m1);

    mat4.copy(m1, modelMatrix);
    mat4.translate(m1, m1, vec3.fromValues(1 + 2 * this.pistonPosition, -5.25, -8.5));
    mat4.scale(m1, m1, vec3.fromValues(6, 0.25, 0.5));
    this.box.draw(v, m1);
  };

  sg.objects.Train.prototype.tick = function(delta) {
    this.positionDirty = true;
    this.derivativeDirty = true;
    this.positionTick += delta * 0.00025;
    if (this.positionTick >= this.track.path.upperDomainBound()) {
      this.positionTick -= this.track.path.upperDomainBound();
    }

    this.pistonPosition += this.pistonDirection * delta * 0.005;
    if ((this.pistonPosition > 1 && this.pistonDirection > 0) ||
        (this.pistonPosition < 0 && this.pistonDirection < 0)) {
      this.pistonDirection *= -1;
    }
  }
})();
