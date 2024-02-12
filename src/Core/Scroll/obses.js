import raf from '../../Utils/raf';
import sub from '../methods/observer';
import { query } from '../methods/methods';

let globalObs = false;
export default function setGlobalObses() {
  if (!globalObs) {
    history.scrollRestoration = 'manual';

    window.onpointerdown = sub.obs('pointerdown').cb;
    window.onpointermove = sub.obs('pointermove').cb;
    window.onpointerup = sub.obs('pointerup').cb;

    window.onkeydown = sub.obs('keydown').cb;
    window.onwheel = sub.obs('wheel').cb;
    window.onresize = sub.obs('resize').cb;

    raf.push({ cb: sub.obs('raf').cb });

    globalObs = true;

    const overlay = query.node('div');
    overlay.setAttribute('data-overlay', '');
    overlay.style.cssText = `
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    `;

    document.body.appendChild(overlay);
  }
}
