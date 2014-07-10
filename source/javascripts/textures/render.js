var sg = sg || {};
sg.textures = sg.textures || {};

(function() {
  sg.textures.Render = function(context, id, options) {
    var actualOptions = options || {};

    this.context = context;
    this.gl = this.context.gl;

    this.frameBuffer = this.gl.createFramebuffer();
    this.frameBuffer.width = 512;
    this.frameBuffer.height = 512;
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);

    this.texture = this.gl.createTexture();
    this.gl.bindTexture(
      this.gl.TEXTURE_2D,
      this.texture);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR);
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.frameBuffer.width,
      this.frameBuffer.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null);

    this.renderbuffer = this.gl.createRenderbuffer();
    this.gl.bindRenderbuffer(
      this.gl.RENDERBUFFER,
      this.renderbuffer);
    this.gl.renderbufferStorage(
      this.gl.RENDERBUFFER,
      this.gl.DEPTH_COMPONENT16,
      this.frameBuffer.width,
      this.frameBuffer.height);

    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      this.texture,
      0);
    this.gl.framebufferRenderbuffer(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.RENDERBUFFER,
      this.renderbuffer);

    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

    this.slotMap = [
      this.gl.TEXTURE0,
      this.gl.TEXTURE1,
      this.gl.TEXTURE2,
      this.gl.TEXTURE3,
      this.gl.TEXTURE4,
      this.gl.TEXTURE5,
      this.gl.TEXTURE6,
      this.gl.TEXTURE7,
      this.gl.TEXTURE8,
    ];
  };

  sg.textures.Render.prototype.bind = function(slot) {
    this.gl.activeTexture(this.slotMap[slot]);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  };
})();
