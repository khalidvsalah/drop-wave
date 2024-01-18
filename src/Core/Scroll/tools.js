import { sub, raf, iSet } from '../../index';

function Init() {
  let called = false;

  return () => {
    if (called) return;
    called = true;

    const overlay = iSet.node('div');

    const cssText = `
      position: absolute;
      top: 0; left: 0;

      height: 100%;
      width: 100%;

      pointer-events: none;
    `;

    overlay.id = 'overlay';

    overlay.style.cssText = cssText;
    overlay.style.zIndex = '999';

    document.body.appendChild(overlay);

    window.addEventListener('pointerdown', sub.obs('pointerdown').cb);
    window.addEventListener('pointermove', sub.obs('pointermove').cb);
    window.addEventListener('pointerup', sub.obs('pointerup').cb);

    window.addEventListener('keydown', sub.obs('keydown').cb);

    window.addEventListener('wheel', sub.obs('wheel').cb);
    window.addEventListener('resize', sub.obs('resize').cb);

    raf.push({ cb: sub.obs('raf').cb });
  };
}

export const events = Init();

/**
 * Handing mouse moving
 */
export function drag(dir, e) {
  dir.prev = dir.end;
  dir.end = e;

  let diff = dir.end - dir.start;
  return -diff;
}
