import alpha from './properties/alpha';
import blur from './properties/blur';

import d from './properties/d';
import dash from './properties/dash';
import draw from './properties/draw';
import points from './properties/points';

import transform from './properties/transform';

import top from './properties/top';

import width from './properties/width';
import height from './properties/height';

const regexs = [
  [/^(form)$/, transform],
  [/^(a)$/, alpha],
  [/^(draw)$/, draw],
  [/^(dash)$/, dash],
  [/^(points)$/, points],
  [/^(d)$/, d],
  [/^(top)$/, top],
  [/^(blur)$/, blur],
  [/^(width)$/, width],
  [/^(height)$/, height]
];

export default regexs;
