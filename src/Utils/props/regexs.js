import alpha from './properties/alpha';
import d from './properties/d';
import dash from './properties/dash';
import points from './properties/points';
import top from './properties/top';
import transform from './properties/transform';
import blur from './properties/blur';
import width from './properties/width';
import height from './properties/height';

const regexs = [
  [/^(form)$/, transform],
  [/^(a)$/, alpha],
  [/^(dash)$/, dash],
  [/^(points)$/, points],
  [/^(d)$/, d],
  [/^(top)$/, top],
  [/^(blur)$/, blur],
  [/^(width)$/, width],
  [/^(height)$/, height]
];

export default regexs;
