var sg = sg || {};

sg.Application = function(canvas) {
  this.context = new sg.Context(canvas);
  this.scene = new sg.Scene(this.context);
  this.clock = new sg.Clock();
};

sg.Application.prototype.run = function() {
  var instance = this;
  window.requestAnimationFrame(function() {
    instance.run();
  });

  this.scene.draw();
  this.scene.tick(this.clock.tick());
};

sg.Application.prototype.onMouseMovement = function(event) {
  this.scene.onMouseMovement(event);
};
