import { Store } from "../../../../index";
import Tween from "./Tween";

const S = new Store();

function tweenController(item, obj) {
  let stored = S.get(item);
  let tween = stored;

  if (!stored) {
    tween = new Tween(item, obj);
    S.set(item, tween);
  }

  return {
    reverse: () => tween.reverse(),
    pause: () => tween.pause(),
    resume: () => tween.resume(),
    play: (o) => tween.play(o),
    item,
    tween,
  };
}

function Control(items, o) {
  if (items.length) {
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
    return {
      reverse: () => tweens.map(({ reverse }) => reverse()),
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
