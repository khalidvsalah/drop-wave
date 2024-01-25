import { tween, iSet } from '../../dist/main.js';

// import * as dat from '../../node_modules/dat.gui/build/dat.gui.module.js';

// // /**
// //  *! Notes !
// //  * Run different set of properties instantly on different tweens
// //  */

// /*
//   Alpha
// */
// tween(iSet.el('.alpha'), {
//   d: 1,
//   late: 1,
//   ease: 'o6',
//   p: { a: [0] }
// });

// /*
//   Blur
// */
// tween(iSet.el('.blur'), {
//   d: 1,
//   late: 1,
//   ease: 'o6',
//   p: { blur: [12] }
// });

// /*
//   Top
// */
// tween(iSet.el('.top'), {
//   d: 1,
//   late: 1,
//   ease: 'o6',
//   p: { t: [50, '%'] }
// });

// /*
//   transform
// */
// tween(iSet.el('.transform'), {
//   d: 1,
//   late: 1,
//   ease: 'io3',
//   p: { form: { x: [50, '%'], rx: [0, 90] } }
// });

// /*
//   Width
//   dir: -1
// */

// // /* ****************************************** */

// /*
//   Object
// */
// const obj = { x: 0, y: 5 };

// const or = tween(obj, {
//   d: 1,
//   ease: 'io3',
//   p: { x: [3], y: [2] },
//   completed: (e) => {
//     tween(e, {
//       d: 1,
//       ease: 'o3',
//       p: { x: [50] },
//       completed: () => {
//         console.log('done');
//       }
//     });
//   }
// });

// /* ****************************************** */
// /*
//   reverse
// */

// setTimeout(() => {
//   tween(iSet.els('.width'), {
//     d: 1,
//     ease: 'io3',
//     p: { a: [0] }
//   });

//   setTimeout(() => {
//     re.reverse({
//       late: 2,
//       completed: () => console.log('--reverse--')
//     });
//   }, 1200);
// }, 1000);

// const gui = new dat.GUI();

// const person = { age: 50 };
// gui.add(person, 'age', 0, 100);

// window.addEventListener('pointermove', sub.obs('pointermove').cb);
// raf.push({ cb: sub.obs('raf').cb });

// tween('.width', {
//   late: 1,
//   d: 1.5,
//   ease: 'io6',
//   p: {
//     width: [90, '%'],
//     height: [40, '%']
//   }
// });

tween('.width', {
  late: 1,
  d: 1.5,
  p: {
    width: [90, '%', { ease: 'o6' }],
    height: [40, '%', { ease: 'io6' }]
  }
});

const circle = iSet.el('.circle circle');

tween(circle, {
  late: 1,
  d: 0.75,
  ease: 'io4',
  p: { dash: [0] }
});
