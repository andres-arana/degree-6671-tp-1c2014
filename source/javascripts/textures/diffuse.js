var sg = sg || {};
sg.textures = sg.textures || {};

(function() {
  sg.textures.Diffuse = function(context, id, options) {
    var actualOptions = options || {};

    this.context = context;
    this.gl = this.context.gl;

    this.image = document.getElementById(id);
    this.texture = this.gl.createTexture();

    this.gl.bindTexture(
      this.gl.TEXTURE_2D,
      this.texture);

    this.gl.pixelStorei(
      this.gl.UNPACK_FLIP_Y_WEBGL,
      true);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.image);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR);

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR_MIPMAP_NEAREST);

    if (options.repeat) {
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.REPEAT);

      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.REPEAT);
    }

    this.gl.generateMipmap(
      this.gl.TEXTURE_2D);

    this.gl.bindTexture(
      this.gl.TEXTURE_2D,
      null);

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

  sg.textures.Diffuse.prototype.bind = function(slot) {
    this.gl.activeTexture(this.slotMap[slot]);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  };
})();
