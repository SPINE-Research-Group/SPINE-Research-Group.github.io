(function () {
  var trigger = document.querySelector('.person-research-trigger');
  var viewer = document.getElementById('person-research-viewer');
  if (!trigger || !viewer) return;

  var canvas = viewer.querySelector('[data-research-canvas]');
  var image = viewer.querySelector('.person-research-expanded-image');
  var closeButton = viewer.querySelector('[data-research-close]');
  var zoomInButton = viewer.querySelector('[data-research-zoom-in]');
  var zoomOutButton = viewer.querySelector('[data-research-zoom-out]');
  var resetButton = viewer.querySelector('[data-research-zoom-reset]');
  var controls = Array.prototype.slice.call(viewer.querySelectorAll('button'));
  var previousFocus = null;
  var zoom = 1;
  var dragging = false;
  var dragged = false;
  var dragStartX = 0;
  var dragStartY = 0;
  var scrollStartLeft = 0;
  var scrollStartTop = 0;

  function clamp(value) {
    return Math.max(1, Math.min(4, value));
  }

  function setZoom(value) {
    var oldZoom = zoom;
    zoom = clamp(value);
    image.style.width = zoom === 1 ? 'auto' : (zoom * 100) + '%';
    image.style.maxWidth = zoom === 1 ? '100%' : 'none';
    image.style.maxHeight = zoom === 1 ? '100%' : 'none';
    canvas.classList.toggle('is-zoomed', zoom > 1);

    if (oldZoom !== zoom) {
      canvas.scrollLeft = (canvas.scrollLeft + canvas.clientWidth / 2) * (zoom / oldZoom) - canvas.clientWidth / 2;
      canvas.scrollTop = (canvas.scrollTop + canvas.clientHeight / 2) * (zoom / oldZoom) - canvas.clientHeight / 2;
    }
  }

  function openViewer() {
    previousFocus = document.activeElement;
    viewer.hidden = false;
    document.body.classList.add('person-research-viewer-open');
    setZoom(1);
    requestAnimationFrame(function () {
      closeButton.focus();
      canvas.scrollLeft = 0;
      canvas.scrollTop = 0;
    });
    document.addEventListener('keydown', onKeyDown);
  }

  function closeViewer() {
    viewer.hidden = true;
    document.body.classList.remove('person-research-viewer-open');
    document.removeEventListener('keydown', onKeyDown);
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      closeViewer();
      return;
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      setZoom(zoom + 0.5);
      return;
    }

    if (event.key === '-') {
      event.preventDefault();
      setZoom(zoom - 0.5);
      return;
    }

    if (event.key === '0') {
      event.preventDefault();
      setZoom(1);
      return;
    }

    if (event.key === 'Tab' && controls.length) {
      var first = controls[0];
      var last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  trigger.addEventListener('click', openViewer);
  closeButton.addEventListener('click', closeViewer);
  zoomInButton.addEventListener('click', function () { setZoom(zoom + 0.5); });
  zoomOutButton.addEventListener('click', function () { setZoom(zoom - 0.5); });
  resetButton.addEventListener('click', function () { setZoom(1); });

  viewer.addEventListener('click', function (event) {
    if (event.target === viewer) closeViewer();
  });

  image.addEventListener('click', function () {
    if (dragged) {
      dragged = false;
      return;
    }
    setZoom(zoom >= 4 ? 1 : zoom + 0.5);
  });

  canvas.addEventListener('wheel', function (event) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
  }, { passive: false });

  canvas.addEventListener('pointerdown', function (event) {
    if (zoom <= 1 || event.button !== 0) return;
    event.preventDefault();
    dragging = true;
    dragged = false;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    scrollStartLeft = canvas.scrollLeft;
    scrollStartTop = canvas.scrollTop;
    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
    }
    canvas.classList.add('is-dragging');
  });

  canvas.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    var deltaX = event.clientX - dragStartX;
    var deltaY = event.clientY - dragStartY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) dragged = true;
    canvas.scrollLeft = scrollStartLeft - deltaX;
    canvas.scrollTop = scrollStartTop - deltaY;
  });

  function stopDragging(event) {
    if (!dragging) return;
    dragging = false;
    if (canvas.releasePointerCapture && canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    canvas.classList.remove('is-dragging');
  }

  canvas.addEventListener('pointerup', stopDragging);
  canvas.addEventListener('pointercancel', stopDragging);
  image.addEventListener('dragstart', function (event) {
    event.preventDefault();
  });
})();
