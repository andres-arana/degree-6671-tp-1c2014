var sg = sg || {};
sg.cameras = sg.cameras || {};

(function() {
  sg.cameras.utilities = {

    rotateAroundCenter: function(result, center, rho, theta, distance) {
      var sinr = Math.sin(rho);
      var sint = Math.sin(theta);
      var cosr = Math.cos(rho);
      var cost = Math.cos(theta);

      vec3.set(
        result,
        distance * sinr * cost + center[0],
        distance * cosr * cost + center[1],
        distance * sint + center[2]);
    },

    cycleAngle: function(angle) {
      if (angle > 2 * Math.PI) {
        angle -= 2 * Math.PI;
      } else if (angle < 0) {
        angle += 2 * Math.PI;
      }

      return angle;
    },

    clampAngle: function(angle) {
      if (angle >= Math.PI / 2) {
        angle = Math.PI / 2;
      } else if (angle <= -Math.PI / 2) {
        angle = -Math.PI / 2;
      }

      return angle;
    },
  };
})();
