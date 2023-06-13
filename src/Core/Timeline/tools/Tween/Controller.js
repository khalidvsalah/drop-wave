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
    pause: () => tween.pause(),
    resume: () => tween.resume(),
    play: (o) => tween.play(o, obj.delay),
    item,
    tween,
  };
}

function Control(items, o) {
  if (typeof items === "object" && items.length) {
    const tweens = [...items].map((item, k) => {
      if (k === 0) {
        return tweenController(item, o);
      } else {
        let delay = (o.delay || 0) + (o.stagger || 0) * k;

        if (items.length !== k + 1) {
          o.raf = null;
          o.completed = null;
        }

        return tweenController(item, {
          ...o,
          delay,
          raf: undefined,
          completed: undefined,
        });
      }
    });

    tweens.map(({ play }) => play(o));
    let ds = tweens.map((t) => t.tween.delay.delay);

    return {
      reverse: () => tweens.map(({ reverse }, i) => reverse(ds.reverse()[i])),
      pause: () => tweens.map(({ pause }) => pause()),
      resume: () => tweens.map(({ resume }) => resume()),
      play: () => tweens.map(({ play }) => play(o)),
    };
  } else {
    const tween = tweenController(items, o);
    tween.play(o);
    return tween;
  }
}

export default Control;
