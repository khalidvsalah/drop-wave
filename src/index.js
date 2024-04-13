import ease from './Math/ease';
import { clamp, lerp, map, remap, round, dist, damp } from './Math/math';

import { isHas, toString } from './Utils/methods/object';
import { bounds, computed } from './Utils/methods/eleProps';

import win from './Utils/methods/window';
import css from './Utils/methods/css';
import query from './Utils/methods/query';
import choke from './Utils/methods/choke';

import props from './Utils/props/props';
import raf from './Utils/raf/raf';
import scrub from './Utils/helpers/scrub';
import late from './Core/late/late';
import tween from './Core/tween/index';

import observer from './Core/Observer/observer';
import scroll from './Core/scroll/scroll';

import line from './Plugins/line/line';

export {
  ease,
  clamp,
  lerp,
  map,
  remap,
  round,
  dist,
  damp,
  isHas,
  toString,
  bounds,
  computed,
  win,
  css,
  query,
  choke,
  props,
  raf,
  late,
  scrub,
  tween,
  observer,
  scroll,
  line
};
