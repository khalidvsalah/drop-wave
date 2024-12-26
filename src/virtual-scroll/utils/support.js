import { win } from '../../methods/window';

export const keyCodes = {
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  SPACE: 'Space',
};

export const device = {
  agent: navigator.userAgent.toLowerCase(),
  get isMobile() {
    return /mobi|android|tablet|ipad|iphone/.test(this.agent);
  },
  get isFirefox() {
    return this.agent.indexOf('firefox') > -1;
  },
};

export const scaler = {
  mouse: 1,
  drag:
    device.isMobile ||
    win.html.classList.contains('mobile') ||
    win.html.classList.contains('tablet')
      ? 2
      : 1.25,
};
