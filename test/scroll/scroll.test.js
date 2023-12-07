import { scroll, iSet } from '../../dist/main.js';

const scoll = new scroll(window, { target: iSet.id('app') });

scoll.add(iSet.el('.media'), {
  p: { form: { sx: [0.5] } },
  scroll: true,
  pin: { start: 0.5, end: 2000 }
  // ease: 'io3',
  // end: -0.5
});

// scoll.add(iSet.el('.media'), {
//   p: { width: [100, 'px'] },
//   scroll: true,
//   // pin: { start: 0.8 },
//   // ease: 'io3'
//   end: -0.5
// });
