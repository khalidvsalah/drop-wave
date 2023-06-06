import { Store } from "../../../../index";
import Tween from "./Tween";

const S = new Store();

function tweenController(item, obj) {
  let stored = S.get(item);
  let tween = stored ? stored : null;

  if (!stored) {
    tween = new Tween(item, obj);
    S.set(item, tween);
  }

  return {
    reverse: (delay) => {
      tween.reverse();
    },
    pause: () => {
      tween.pause();
    },
    resume: () => {
      tween.resume();
    },
    play: (p) => {
      tween.play(p, "");
    },
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
        let delay = o.delay || 0;
        let add = delay + (o.stagger || 0) * k;

        if (items.length !== k + 1) {
          o.raf = null;
          o.completed = null;
        }

        return tweenController(item, { ...o, delay: add });
      }
    });

    tweens.map(({ play }) => play(o));
    return tweens;
  } else {
    const tween = tweenController(items, o);
    tween.play(o);
    return tween;
  }
}

export default Control;
