import './types/types';

export { easingFn } from './math/easing/index';
export { clamp, lerp, normalize, map, round, dist, damp } from './math/math';

export { computed } from './methods/computed';
export { bounds, offset } from './methods/coordinate';
export { win } from './methods/window';
export { css } from './methods/css';
export { debounce } from './methods/debounce';

export { observer } from './utils/Observer';
export { raf } from './utils/Raf';
export { Delay } from './utils/Delay';

export { kill } from './core/tween/kill';
export { tween } from './core/tween/tween';
export { Timeline } from './core/timeline/Timeline';
export { Trigger } from './core/trigger/Trigger';

export { splitText } from './plugins/splitText';
export { register } from './plugins/register';
