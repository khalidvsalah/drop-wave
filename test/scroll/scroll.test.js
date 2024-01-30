import { scroll, iSet, sub, raf } from '../../dist/main.js';

const resize = sub.obs('resize').cb;

(() => {
  window.addEventListener('pointerdown', sub.obs('pointerdown').cb);
  window.addEventListener('pointermove', sub.obs('pointermove').cb);
  window.addEventListener('pointerup', sub.obs('pointerup').cb);

  window.addEventListener('keydown', sub.obs('keydown').cb);
  window.addEventListener('wheel', sub.obs('wheel').cb);
  window.addEventListener('resize', resize);

  raf.push({ cb: sub.obs('raf').cb });
})();

const root = iSet.id('app');
const box = iSet.el('.box');

const vscroll = new scroll(window, { target: root });
vscroll.add(box, {
  scroll: { width: [250, 'px'] },
  start: 0,
  end: 0,
  pin: {
    a: box.offsetTop,
    z: box.offsetTop + iSet.size.h * 0.2
  }
});
resize();
