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

    globalObs = true;
  }
}
