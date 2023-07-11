import { Store } from "../../../../index";
import Tween from "./Tween";

const s = new Store();
function tweenController(item, obj) {
  let stored = s.get(item);

  let tween = stored;

  if (!stored) {
    tween = new Tween(item, obj);
    s.set(item, tween);
  }

  return {
    reverse: (d) => tween.reverse(d),
    play: (o) => tween.play(o, obj.late),
    item,
    tween,
    obj,
  };
}

function Control(items, o) {
  if (items instanceof NodeList) {
    const tweens = [...items].map((item, k) => {
      let late = (o.late || 0) + (o.stagger || 0) * k;
      return tweenController(item, { ...o, late });
    });

    tweens.map(({ play, obj }, i) => {
      if (i === 0)
        play({
          ...obj,
          start: o.start,
          raf: o.raf,
          completed: o.completed,
        });
      else
        play({
          ...obj,
          start: undefined,
          raf: undefined,
          completed: undefined,
        });
    });

    let lates = tweens.map((t) => t.tween.late.late);

    return {
      reverse: (d) => {
        let late = o.late - d;
        tweens.map(({ reverse }, i) => reverse(lates.reverse()[i] - late));
      },
      play: () => tweens.map(({ play }) => play(o)),
    };
  } else {
    const tween = tweenController(items, o);
    tween.play(o);
    return tween;
  }
}

export default Control;
