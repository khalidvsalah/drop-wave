import Tween from './tween';

const events = (o, i, length) => {
  const obj = { ...o };

  if (i !== 0) {
    obj.started = null;
    obj.raf = null;
  }

  if (i !== length) obj.completed = null;
  obj.late = o.late + o.space * i;

  return obj;
};
const change = (obj, o) => {
  o.d = typeof obj.d === 'number' ? obj.d : o.d || 0.5;
  o.late = typeof obj.late === 'number' ? obj.late : o.late || 0;
  o.space = typeof obj.space === 'number' ? obj.space : o.space || 0;
  o.ease = obj.ease ? obj.ease : o.ease || 'l';
  o.p = obj.p;
};

/**
 * Tween Interface.
 *
 * @param {HTMLElement|NodeList|string} nodes - nodes elment.
 * @param {Object} o - Tween properties.
 * @returns {Control}.
 */
function Interface(els, o) {
  let nodes;

  if (Array.isArray(els) && !o.obj) nodes = els;
  else nodes = [els];

  const tweens = nodes.map(node => new Tween(node));
  const length = tweens.length - 1;

  const methods = {
    reverse: (obj = {}) => {
      change(obj, o);
      for (let i = 0; i <= length; i++) {
        const idx = length - i;
        tweens[i].play(events(o, idx, length), 'r');
      }
    },
    play: (obj = {}) => {
      change(obj, o);
      tweens.map((tween, i) => tween.play(events(o, i, length), 'p'));
    },
    tweens
  };

  methods.play(o);
  return methods;
}

export default Interface;
