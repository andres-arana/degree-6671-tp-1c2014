var sg = sg || {};
sg.objects = sg.objects || {};

(function() {


  sg.objects.Skybox = function(context) {
    this.context = context
    this.gl = this.context.gl;

    this.rectangle = new sg.geometries.Rectangle(context);
    this.transform = mat4.create();

    this.planes = [];
    var transform = mat4.create();
    var texture;

    texture = new sg.textures.Diffuse(this.context, "texture-skybox-front");
    mat4.identity(transform);
    mat4.translate(transform, transform, vec3.fromValues(0, 100, 0));
    mat4.scale(transform, transform, vec3.fromValues(100, 100, 100));
    mat4.rotateZ(transform, transform, -Math.PI);
    this.planes.push({texture: texture, transform: mat4.clone(transform)});

    texture = new sg.textures.Diffuse(this.context, "texture-skybox-left");
    mat4.identity(transform);
    mat4.translate(transform, transform, vec3.fromValues(-100, 0, 0));
    mat4.scale(transform, transform, vec3.fromValues(100, 100, 100));
    mat4.rotateZ(transform, transform, -Math.PI / 2);
    this.planes.push({texture: texture, transform: mat4.clone(transform)});

    texture = new sg.textures.Diffuse(this.context, "texture-skybox-back");
    mat4.identity(transform);
    mat4.translate(transform, transform, vec3.fromValues(0, -100, 0));
    mat4.scale(transform, transform, vec3.fromValues(100, 100, 100));
    this.planes.push({texture: texture, transform: mat4.clone(transform)});

    texture = new sg.textures.Diffuse(this.context, "texture-skybox-right");
    mat4.identity(transform);
    mat4.translate(transform, transform, vec3.fromValues(100, 0, 0));
    mat4.scale(transform, transform, vec3.fromValues(100, 100, 100));
    mat4.rotateZ(transform, transform, Math.PI / 2);
    this.planes.push({texture: texture, transform: mat4.clone(transform)});

    texture = new sg.textures.Diffuse(this.context, "texture-skybox-top");
    mat4.identity(transform);
    mat4.translate(transform, transform, vec3.fromValues(0, 0, 100));
    mat4.scale(transform, transform, vec3.fromValues(100, 100, 100));
    mat4.rotateZ(transform, transform, -Math.PI / 2);
    mat4.rotateX(transform, transform, -Math.PI / 2);
    this.planes.push({texture: texture, transform: mat4.clone(transform)});

    this.modelViewMatrix = mat4.create();
    this.normalMatrix = mat3.create();
  };

  sg.objects.Skybox.prototype.draw = function(shader, v, m) {
    for (var i = 0; i < this.planes.length; i++) {
      var plane = this.planes[i];
      shader.setTexture(plane.texture);
      mat4.multiply(this.transform, m, plane.transform);
      this.drawRectangle(this.rectangle, shader, v, this.transform);
    };
  };

  sg.objects.Skybox.prototype.drawRectangle = function(obj, shader, v, m) {
    mat4.multiply(this.modelViewMatrix, v, m);
    shader.setModelViewMatrix(this.modelViewMatrix)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, obj.vertexBuffer);

    var position = shader.getPositionAttribute();
    this.gl.vertexAttribPointer(
      position,
      3,
      this.gl.FLOAT,
      false,
      obj.recordLength,
      obj.positionOffset);

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
      this.gl.TRIANGLES,
      obj.indexBuffer.items,
      this.gl.UNSIGNED_SHORT,
      0);

  };

})();
