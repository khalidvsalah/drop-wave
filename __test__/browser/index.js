import {
  query,
  tween,
  states,
  raf,
  splitText,
  register,
  scroll,
  win
} from '../../src/index';

document.onvisibilitychange = states.create('visibilitychange').notify;
document.onresize = states.create('resize').notify;
document.onpointerdown = states.create('pointerdown').notify;
document.onpointerup = states.create('pointerup').notify;
document.onpointermove = states.create('pointermove').notify;
document.onkeydown = states.create('keydown').notify;
document.onwheel = states.create('wheel').notify;

raf.push({ cb: states.create('raf').notify });

// register('width', {
//   cssName: 'width',
//   callback: p => {
//     const lerp = p[1] - p[0];
//     return time => `${p[0] + lerp * time}%`;
//   }
// });

// const visual = new scroll(query.id('root'));
// visual.add(query.el('header'), {
//   scroll: true,
//   animate: { width: [100, 80] },
//   start: 0,
//   end: '+100'
// });

// const verions = splitText(query.el('.version'), { letters: true }).letters;
// visual.add(verions[0], {
//   scroll: true,
//   animate: { move: { y: [0, -150] } },
//   start: '-' + win.screen.h / 1.5,
//   end: '+100'
// });
// visual.add(verions[1], {
//   scroll: true,
//   animate: { move: { y: [0, -300] } },
//   start: '-' + win.screen.h / 1.5,
//   end: '+100'
// });
// visual.add(verions[3], {
//   scroll: true,
//   animate: { move: { y: [0, -200] } },
//   start: '-' + win.screen.h / 1.5,
//   end: '+100'
// });
// visual.add(query.el('.img_1'), {
//   scroll: true,
//   animate: { move: { y: [0, -25, '%'] } },
//   start: '-50%',
//   end: '+100%'
// });
// visual.add(query.el('.wrapper img'), {
//   container: query.el('.lerp'),
//   scroll: true,
//   animate: { move: { y: [0, -25, '%'] } },
//   start: '-50%',
//   end: '+100%'
// });
