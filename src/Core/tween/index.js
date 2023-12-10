import Tween from './tween';

/**
 * Tween Interface.
 *
 * @param {HTMLElement|NodeList|string} nodes - nodes elment.
 * @param {Object} o - Tween properties.
 * @returns {Control}.
 */
function Interface(els, o) {
  let nodes;

  if (els instanceof NodeList || Array.isArray(els)) nodes = [...els];
  else nodes = [els];

  const tweens = nodes.map((node, i) => {
    /**
     * Tweens staggering.
     */
    let late = (o.late || 0) + (o.space * i || 0);
    return new Tween(node, { ...o, late });
  });

  /**
   * Play.
   */
  tweens.map((tw, i) => tw.play(o, i));

  /**
   * Store element late time.
   */
  let lates = tweens.map((tw) => tw.late.d);

  return {
    reverse: (obj = {}) => {
      let late = (o.late || 0) - obj.late;
      tweens.map((tw, i) => {
        obj.late = lates[i] - late;
        tw.reverse(obj);
      });
    },
    play: () => tweens.map((tw, i) => tw.play(o, i))
  };
}

export default Interface;
