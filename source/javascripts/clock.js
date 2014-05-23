var sg = sg || {};

(function() {

  sg.Clock = function() {
    this.lastTime = 0;
  };

  sg.Clock.prototype.tick = function() {
    var previousTime = this.lastTime;
    this.lastTime = new Date().getTime();
    if (previousTime == 0) {
      return 0.0;
    } else {
      return this.lastTime - previousTime;
    }
  };

})();
