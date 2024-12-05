import opacity from '../../components/opacity/opacity';
import transform from '../../components/transform/transform';
import clipPath from '../../components/clipPath/clipPath';
import filter from '../../components/filter/filter';
import draw from '../../components/draw/draw';

export default [
  [/^(transform)/, transform],
  [/^(opacity)/, opacity],
  [/^(clipPath)/, clipPath],
  [/^(filter)/, filter],
  [/^(draw)/, draw],
];
