(() => {
  const $ = s => document.querySelector(s);
  const game = $('#game');
  const ext = $('#extinguisher');
  const zone = $('#fireZone');
  const fireOn = $('#fireOn');
  const fireOff = $('#fireOff');
  const okSound = $('#okSound');
  const resetBtn = $('#resetBtn');
  const toast = $('#toast');

  let dragging = false;
  let solved = false;
  let offsetX = 0, offsetY = 0;

  // Helper: element rect in page coordinates
  const rect = el => el.getBoundingClientRect();

  function showToast(msg='정답입니다!') {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function playOK() { try { okSound.currentTime = 0; okSound.play(); } catch(e) {} }

  function onPointerDown(e) {
    if (solved) return;
    dragging = true;
    ext.style.cursor = 'grabbing';
    const r = rect(ext);
    const pX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const pY = e.clientY ?? (e.touches && e.touches[0].clientY);
    offsetX = pX - r.left;
    offsetY = pY - r.top;
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging || solved) return;
    const pX = (e.clientX !== undefined) ? e.clientX : (e.touches ? e.touches[0].clientX : 0);
    const pY = (e.clientY !== undefined) ? e.clientY : (e.touches ? e.touches[0].clientY : 0);
    const x = pX - offsetX;
    const y = pY - offsetY;
    ext.style.left = x + 'px';
    ext.style.top  = y + 'px';
  }

  function hitTest(a, b) {
    const ra = rect(a), rb = rect(b);
    const ax = ra.left + ra.width/2, ay = ra.top + ra.height/2;
    return ax > rb.left && ax < rb.right && ay > rb.top && ay < rb.bottom;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    ext.style.cursor = 'grab';

    if (hitTest(ext, zone) && !solved) {
      solved = true;
      // swap fire images
      fireOn.style.display = 'none';
      fireOff.style.display = 'block';

      // lock extinguisher and fade it out
      ext.style.transition = 'opacity .35s ease, transform .35s ease';
      ext.style.transform = 'scale(.9)';
      ext.style.opacity = '0';
      setTimeout(() => { ext.style.display = 'none'; }, 400);

      playOK();
      showToast('정답입니다!');
      resetBtn.style.display = 'block';
    }
  }

  // pointer/touch listeners
  ext.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  // iOS Safari touch fallback
  ext.addEventListener('touchstart', onPointerDown, {passive:false});
  window.addEventListener('touchmove', onPointerMove, {passive:false});
  window.addEventListener('touchend', onPointerUp);

  // Reset (optional)
  resetBtn.addEventListener('click', () => {
    solved = false;
    fireOn.style.display = 'block';
    fireOff.style.display = 'none';
    ext.style.display = 'block';
    ext.style.opacity = '1';
    ext.style.transform = 'none';
    // return extinguisher to original spot
    ext.style.left = '';
    ext.style.top = '';
    resetBtn.style.display = 'none';
  });
})();