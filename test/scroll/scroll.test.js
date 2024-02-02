import { scroll, query, sub, raf } from '../../dist/main.js';

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

const root = query.id('app');
const box = query.el('.box');
const inner = query.el('.inner');

const vscroll = new scroll(root, { target: root, dir: 'x' });
resize();
vscroll.add(box, {
  target: inner,
  scroll: { form: [{ x: [-100, 'px'] }] }
});
