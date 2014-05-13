var sg = sg || {};

sg.Application = function(canvas) {
  this.width = canvas.width;
  this.height = canvas.height;
  this.gl = canvas.getContext("webgl");
  this.scene = new sg.Scene(this.gl);
  this.clock = new sg.Clock();
};

sg.Application.prototype.run = function() {
  var instance = this;
  window.requestAnimationFrame(function() {
    instance.run();
  });

  this.gl.viewport(0, 0, this.width, this.height);
  this.scene.draw();
  this.scene.tick(this.clock.tick());
};
