var sg = sg || {};

(function() {

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

  sg.Application.prototype.onKeyHeld = function(event) {
    this.scene.onKeyHeld(event);
  };

  sg.Application.prototype.onKeyReleased = function(event) {
    this.scene.onKeyReleased(event);
  };

})();
