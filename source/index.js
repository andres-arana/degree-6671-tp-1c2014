(function() {
  function normalizeMovementEvent(event) {
    event.movementX = event.movementX ||
      event.mozMovementX ||
      event.webkitMovementX;

    if (typeof event.movementX === 'undefined') {
      event.movementX = 0;
    }

    event.movementY = event.movementY ||
      event.mozMovementY ||
      event.webkitMovementY;

    if (typeof event.movementY === 'undefined') {
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
    var application = new sg.Application(canvas);

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

    var keyHeld = function(event) {
      application.onKeyHeld(event);
    };

    var keyReleased = function(event) {
      application.onKeyReleased(event);
    };

    canvas.addEventListener("click", canvasClicked);
    document.addEventListener("pointerlockchange", pointerLockChanged);
    document.addEventListener("mozpointerlockchange", pointerLockChanged);
    document.addEventListener("webkitpointerlockchange", pointerLockChanged);
    document.addEventListener("keydown", keyHeld);
    document.addEventListener("keyup", keyReleased);

    application.run();
  };

  document.addEventListener("DOMContentLoaded", function() {
    imagesLoaded(document, startApplication);
  });

})();
