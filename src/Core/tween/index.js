import Tween from './tween';

const delay = (o, obj, idx) => {
  const space = typeof obj.space === 'number' ? obj.space : o.space || 0;
  const late = typeof obj.late === 'number' ? obj.late : o.late;
  return late + space * idx;
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

  const tweens = nodes.map((node, i) => {
    const obj = { ...o };

    if (i === 0) {
      obj.started = o.started;
      obj.raf = o.raf;
    } else {
      obj.started = null;
      obj.raf = null;
    }

    if (i === nodes.length - 1) obj.completed = o.completed;
    else obj.completed = null;

    return new Tween(node, { ...obj, late: delay(obj, {}, i) });
  });

  return {
    reverse: (obj = {}) => {
      const length = tweens.length;
      for (let i = 0; i < length; i++) {
        const idx = length - i - 1;
        tweens[i].play({ late: delay(o, obj, idx), d: obj.d }, 'r');
      }
    },
    play: (obj = {}) => {
      tweens.map((tween, i) => {
        tween.play({ late: delay(o, obj, i), d: obj.d }, 'p');
      });
    }
  };
}

export default Interface;
