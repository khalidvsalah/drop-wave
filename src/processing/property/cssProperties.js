import opacity from '../../components/opacity/opacity';
import transform from '../../components/transform/transform';
import clipPath from '../../components/clipPath/clipPath';
import filter from '../../components/filter/filter';
import draw from '../../components/draw/draw';
import width from '../../components/width/width';
import height from '../../components/height/height';
import left from '../../components/left/left';
import right from '../../components/right/right';
import top from '../../components/top/top';
import bottom from '../../components/bottom/bottom';

export default [
  [/^(transform)/, transform],
  [/^(opacity)/, opacity],
  [/^(clipPath)/, clipPath],
  [/^(filter)/, filter],
  [/^(draw)/, draw],
  [/^(width)/, width],
  [/^(height)/, height],
  [/^(left)/, left],
  [/^(right)/, right],
  [/^(top)/, top],
  [/^(bottom)/, bottom],
];
