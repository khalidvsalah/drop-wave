import opacity from '../../components/opacity';
import transform from '../../components/transform';
import clipPath from '../../components/clipPath';
import filter from '../../components/filter';
import draw from '../../components/draw';

export default [
  [/^(transform|move)/, transform, 'transform'],
  [/^(opacity|alpha)/, opacity, 'opacity'],
  [/^(clip|clipPath)/, clipPath, 'clip-path'],
  [/^(filter)/, filter, 'filter'],
  [/^(draw)/, draw, 'strokeDashoffset'],
];
