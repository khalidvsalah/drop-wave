import { Ease, Store } from "../../../../index";
import Tween from "./Tween";

const S = new Store();

function tweenController(item, g) {
  let re = S.get(item);
  let tw = re ? re : null;

  if (re) {
    if (JSON.stringify(re.props) !== JSON.stringify(g.p)) {
      tw.mode = undefined;

      tw.delay.delay = typeof g.delay === "number" ? g.delay : re.del;
      tw.ease = Ease[g.ease] || re.ease;
      tw.d = typeof g.d === "number" ? g.d : re.d;
      tw.completed = g.completed || 0;
      tw.raf = g.raf || 0;
    }
  } else {
    tw = new Tween(item, g);
    S.set(item, tw);
  }

  return {
    reverse: (delay) => {
      tw.delay.delay = typeof delay === "number" ? delay : tw.del;
      tw.reverse();
    },
    pause: () => {
      tw.pause();
    },
    resume: () => {
      tw.resume();
    },
    play: (p) => {
      tw.play(p);
    },
    item,
    tw,
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

    tweens.map(({ play }) => play(o.p));
    return tweens;
  } else {
    const tween = tweenController(items, o);
    tween.play(o.p);
    return tween;
  }
}

export default Control;
