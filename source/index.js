(function() {
  function normalizeMovementEvent(event) {
    event.movementX = event.movementX ||
      event.mozMovementX ||
      event.webkitMovementX;

    if (typeof event.movementX === 'undefined' || Math.abs(event.movementX) < 3 ) {
      event.movementX = 0;
    }

    event.movementY = event.movementY ||
      event.mozMovementY ||
      event.webkitMovementY;

    if (typeof event.movementY === 'undefined' || Math.abs(event.movementY) < 3 ) {
      event.movementY = 0;
    }

    return event;
  };

  function normalizeRequestPointerLock(element) {
    element.requestPointerLock =
      element.requestPointerLock ||
      element.mozRequestPointerLock ||
      element.webkitRequestPointerLock;

    return element
  };

  function normalizePointerLockChanged(element, mouseEvent) {
    if ( document.pointerLockElement === element ||
         document.mozPointerLockElement === element ||
         document.webkitPointerLockElement === element) {
      document.addEventListener("mousemove", mouseEvent);
    } else {
      document.removeEventListener("mousemove", mouseEvent);
    }
  }

  function startApplication() {
    var canvas = document.getElementById("main-canvas");
    var heightmap = document.getElementById("heightmap");
    var application = new sg.Application(canvas, heightmap);

    var canvasClicked = function() {
      normalizeRequestPointerLock(canvas).
        requestPointerLock();
    };

    var mouseMoved = function(event) {
      var normalizedEvent = normalizeMovementEvent(event);
      application.onMouseMovement(normalizedEvent);
    };

    var pointerLockChanged = function() {
      normalizePointerLockChanged(canvas, mouseMoved);
    };

    canvas.addEventListener("click", canvasClicked);
    document.addEventListener("pointerlockchange", pointerLockChanged);
    document.addEventListener("mozpointerlockchange", pointerLockChanged);
    document.addEventListener("webkitpointerlockchange", pointerLockChanged);

    application.run();
  };

  document.addEventListener("DOMContentLoaded", function() {
    imagesLoaded(".image-data", startApplication);
  });

})();
