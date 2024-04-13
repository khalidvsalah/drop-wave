import alpha from '../properties/alpha';
import blur from '../properties/blur';

import d from '../properties/d';
import dash from '../properties/dash';
import draw from '../properties/draw';
import points from '../properties/points';

import transform from '../properties/transform';

import top from '../properties/top';

import width from '../properties/width';
import height from '../properties/height';

import circle from '../properties/circle';
import polygon from '../properties/polygon';

const regexs = [
  [/^(move)$/, transform],
  [/^(a)$/, alpha],
  [/^(width)$/, width],
  [/^(height)$/, height],
  [/^(top)$/, top],
  [/^(blur)$/, blur],
  [/^(draw)$/, draw],
  [/^(dash)$/, dash],
  [/^(points)$/, points],
  [/^(d)$/, d],
  [/^(circle)$/, circle],
  [/^(polygon)$/, polygon]
];

export default regexs;
