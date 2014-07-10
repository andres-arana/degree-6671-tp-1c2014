var sg = sg || {};
sg.objects = sg.objects || {};

(function() {
  sg.objects.Train = function(context, track) {
    this.context = context;
    this.gl = this.context.gl
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
    this.bodySpecular = vec3.fromValues(0.2, 0.2, 0.2);
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

    this.bump = new sg.textures.Diffuse(
      this.context,
      "bump-metal",
      {repeat: true});

    this.rustyBump = new sg.textures.Diffuse(
      this.context,
      "bump-rusty",
      {repeat: true});

    this.modelMatrix = mat4.create();
    this.derivativeProjection = vec3.create();
    this.yAxisVersor = vec3.fromValues(0, 1, 0);
    this.trainScale = vec3.fromValues(0.2, 0.2, 0.2);
    this.engineContainerScale = vec3.fromValues(5, 5, 5);
    this.engineTopTranslation = vec3.fromValues(5, 0, 0);
    this.engineTopScale = vec3.fromValues(6, 6, 2);
    this.chimmeyTranslation = vec3.fromValues(6, 0, 5);
    this.chimmeyScale = vec3.fromValues(1, 1, 5);
    this.leftPistonHolder = vec3.fromValues(7, 4, -8);
    this.rightPistonHolder = vec3.fromValues(7, -4, -8);
    this.pistonHolderScale = vec3.fromValues(3, 3, 3);
    this.engineTopSecurerTranslation = vec3.fromValues(7, 0, 0);
    this.engineTopSecurerScale = vec3.fromValues(1, 1, 1.5);
    this.engineSupportTranslation = vec3.fromValues(-2, 0, -5);
    this.engineSupportScale = vec3.fromValues(8.75, 6, 0.25);
    this.cockpitTranslation = vec3.fromValues(-5, 0, 0);
    this.cockpitScale = vec3.fromValues(5, 5.75, 5);
    this.cockpitSupportTranslation = vec3.fromValues(-6, 0, -2);
    this.cockpitSupportScale = vec3.fromValues(6, 6, 3);
    this.bottomTranslation = vec3.fromValues(-10, 0, -7.5);
    this.bottomScale = vec3.fromValues(2, 6, 2.5);
    this.pistonProtectorTranslation = vec3.fromValues(-6, 0, -7.5);
    this.pistonProtectorScale = vec3.fromValues(2, 6, 2.5);
    this.firstRoofSupport = vec3.fromValues(0, 5.5, 6);
    this.secondRoofSupport = vec3.fromValues(0, -5.5, 6);
    this.thirdRoofSupport = vec3.fromValues(-9.75, 5.5, 6);
    this.fourthRoofSupport = vec3.fromValues(-9.75, -5.5, 6);
    this.rootSupportScale = vec3.fromValues(0.25, 0.25, 6);
    this.firstRoofSustainer = vec3.fromValues(0, 0, 12);
    this.secondRoofSustainer = vec3.fromValues(-9.75, 0, 12);
    this.thirdRoofSustainer = vec3.fromValues(-5, 5.5, 12);
    this.fourthRoofSustainer = vec3.fromValues(-5, -5.5, 12);
    this.roofSustainerScaleTrans = vec3.fromValues(0.25, 5.75, 0.25);
    this.roofSustainerScaleLong = vec3.fromValues(5, 0.25, 0.25);
    this.roofTranslation = vec3.fromValues(0, 0, 12);
    this.roofScale = vec3.fromValues(6, 10, 2);
    this.firstWheel = vec3.fromValues(3, 5, -8.5);
    this.secondWheel = vec3.fromValues(-3, 5, -8.5);
    this.thirdWheel = vec3.fromValues(3, -3.5, -8.5);
    this.fourthWheel = vec3.fromValues(-3, -3.5, -8.5);
    this.wheelScale = vec3.fromValues(3, 3, 1.5);
    this.firstPiston = vec3.create();
    this.secondPiston = vec3.create();
    this.pistonScale = vec3.fromValues(6, 0.25, 0.5);

    this.m = mat4.create();

    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();
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

  sg.objects.Train.prototype.draw = function(shader, v, m) {
    mat4.copy(this.modelMatrix, m);

    var trainPosition = this.currentPosition();
    var derivative = this.currentDerivative();

    vec3.set(this.derivativeProjection, derivative[0], derivative[1], 0);
    vec3.normalize(this.derivativeProjection, this.derivativeProjection);
    var direction = derivative[0] > 0 ? -1 : 1;
    var rawAngle = vec3.angleBetween(this.derivativeProjection, this.yAxisVersor);
    var angle = (direction * rawAngle) + Math.PI / 2;

    mat4.translate(this.modelMatrix, this.modelMatrix, trainPosition);
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, angle);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.trainScale);

    shader.setBumpMap(this.bump);

    shader.setAmbient(this.bodyAmbient);
    shader.setDiffuse(this.bodyDiffuse);
    shader.setSpecular(this.bodySpecular);
    shader.setShininess(this.bodyShininess);

    // Draw the engine container
    mat4.copy(this.m, this.modelMatrix);
    mat4.rotateY(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.engineContainerScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    // Draw the engine top
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.engineTopTranslation);
    mat4.rotateY(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.engineTopScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    // Draw the chimmey
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.chimmeyTranslation);
    mat4.scale(this.m, this.m, this.chimmeyScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    // Draw both pistons holders
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.leftPistonHolder);
    mat4.rotateY(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.pistonHolderScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.rightPistonHolder);
    mat4.rotateY(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.pistonHolderScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    // Draw engine top securer
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.engineTopSecurerTranslation);
    mat4.rotateY(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.engineTopSecurerScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    // Draw the engine support
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.engineSupportTranslation);
    mat4.scale(this.m, this.m, this.engineSupportScale);
    this.drawBox(this.box, shader, v, this.m);

    // Draw the cockpit
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.cockpitTranslation);
    mat4.scale(this.m, this.m, this.cockpitScale);
    this.drawBox(this.box, shader, v, this.m);

    // Draw the cockpit support
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.cockpitSupportTranslation);
    mat4.scale(this.m, this.m, this.cockpitSupportScale);
    this.drawBox(this.box, shader, v, this.m);

    // Draw the bottom part
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.bottomTranslation);
    mat4.scale(this.m, this.m, this.bottomScale);
    this.drawBox(this.box, shader, v, this.m);

    // Draw the piston protection
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.pistonProtectorTranslation);
    mat4.scale(this.m, this.m, this.pistonProtectorScale);
    mat4.rotateZ(this.m, this.m, Math.PI / 2);
    this.drawTriangular(this.triangular, shader, v, this.m);

    // Draw the roof support
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.firstRoofSupport);
    mat4.scale(this.m, this.m, this.rootSupportScale);
    this.drawBox(this.box, shader, v, this.m);
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.secondRoofSupport);
    mat4.scale(this.m, this.m, this.rootSupportScale);
    this.drawBox(this.box, shader, v, this.m);
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.thirdRoofSupport);
    mat4.scale(this.m, this.m, this.rootSupportScale);
    this.drawBox(this.box, shader, v, this.m);
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.fourthRoofSupport);
    mat4.scale(this.m, this.m, this.rootSupportScale);
    this.drawBox(this.box, shader, v, this.m);

    // Draw the roof sustainer
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.firstRoofSustainer);
    mat4.scale(this.m, this.m, this.roofSustainerScaleTrans);
    this.drawBox(this.box, shader, v, this.m);
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.secondRoofSustainer);
    mat4.scale(this.m, this.m, this.roofSustainerScaleTrans);
    this.drawBox(this.box, shader, v, this.m);
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.thirdRoofSustainer);
    mat4.scale(this.m, this.m, this.roofSustainerScaleLong);
    this.drawBox(this.box, shader, v, this.m);
    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.fourthRoofSustainer);
    mat4.scale(this.m, this.m, this.roofSustainerScaleLong);
    this.drawBox(this.box, shader, v, this.m);

    // Draw the roof
    shader.setAmbient(this.roofAmbient);
    shader.setDiffuse(this.roofDiffuse);
    shader.setSpecular(this.roofSpecular);
    shader.setShininess(this.roofShininess);
    shader.setBumpMap(this.rustyBump);

    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.roofTranslation);
    mat4.rotateZ(this.m, this.m, Math.PI / 2);
    mat4.scale(this.m, this.m, this.roofScale);
    this.drawArc(this.arc, shader, v, this.m);

    // Draw the wheels
    shader.setAmbient(this.wheelsAmbient);
    shader.setDiffuse(this.wheelsDiffuse);
    shader.setSpecular(this.wheelsSpecular);
    shader.setShininess(this.wheelsShininess);

    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.firstWheel);
    mat4.rotateX(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.wheelScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.secondWheel);
    mat4.rotateX(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.wheelScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.thirdWheel);
    mat4.rotateX(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.wheelScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    mat4.copy(this.m, this.modelMatrix);
    mat4.translate(this.m, this.m, this.fourthWheel);
    mat4.rotateX(this.m, this.m, Math.PI/2);
    mat4.scale(this.m, this.m, this.wheelScale);
    this.drawCylinder(this.cylinder, shader, v, this.m);

    // Draw the pistons
    shader.setAmbient(this.pistonAmbient);
    shader.setDiffuse(this.pistonDiffuse);
    shader.setSpecular(this.pistonSpecular);
    shader.setShininess(this.pistonShininess);

    mat4.copy(this.m, this.modelMatrix);
    vec3.set(this.firstPiston, 1 + 2 * this.pistonPosition, 5.25, -8.5);
    mat4.translate(this.m, this.m, this.firstPiston);
    mat4.scale(this.m, this.m, this.pistonScale);
    this.drawBox(this.box, shader, v, this.m);

    mat4.copy(this.m, this.modelMatrix);
    vec3.set(this.secondPiston, 1 + 2 * this.pistonPosition, -5.25, -8.5);
    mat4.translate(this.m, this.m, this.secondPiston);
    mat4.scale(this.m, this.m, this.pistonScale);
    this.drawBox(this.box, shader, v, this.m);
  };

  sg.objects.Train.prototype.tick = function(delta) {
    this.positionDirty = true;
    this.derivativeDirty = true;
    this.positionTick += delta * 0.0001;
    if (this.positionTick >= this.track.path.upperDomainBound()) {
      this.positionTick -= this.track.path.upperDomainBound();
    }

    this.pistonPosition += this.pistonDirection * delta * 0.005;
    if ((this.pistonPosition > 1 && this.pistonDirection > 0) ||
        (this.pistonPosition < 0 && this.pistonDirection < 0)) {
      this.pistonDirection *= -1;
    }
  };

  sg.objects.Train.prototype.drawObject = function(obj, shader, v, m, geometry) {
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
      geometry,
      obj.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);
  }

  sg.objects.Train.prototype.drawCylinder = function(obj, shader, v, m) {
    this.drawObject(obj, shader, v, m, this.gl.TRIANGLE_STRIP);
  };

  sg.objects.Train.prototype.drawBox = function(obj, shader, v, m) {
    this.drawObject(obj, shader, v, m, this.gl.TRIANGLES);
  };

  sg.objects.Train.prototype.drawArc = function(obj, shader, v, m) {
    this.drawObject(obj, shader, v, m, this.gl.TRIANGLE_STRIP);
  };

  sg.objects.Train.prototype.drawTriangular = function(obj, shader, v, m) {
    this.drawObject(obj, shader, v, m, this.gl.TRIANGLES);
  };

})();
