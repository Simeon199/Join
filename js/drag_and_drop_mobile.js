const draggable = document.getElementById('draggable');

draggable.addEventListener('touchstart', function (e) {
    // Verhindert, dass das Standardverhalten ausgelöst wird (z.B. Scrollen)
    e.preventDefault();
    const touch = e.targetTouches[0];
    startX = touch.clientX - draggable.offsetLeft;
    startY = touch.clientY - draggable.offsetTop;
}, false);

draggable.addEventListener('touchmove', function (e) {
    e.preventDefault();
    const touch = e.targetTouches[0];
    draggable.style.left = touch.clientX - startX + 'px';
    draggable.style.top = touch.clientY - startY + 'px';
}, false);

draggable.addEventListener('touchend', function (e) {
    e.preventDefault();
    // Hier kann zusätzlicher Code hinzugefügt werden, um zu prüfen, wo das Element losgelassen wurde
}, false);
