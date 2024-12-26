import './style.css';
import { tween, splitText, win, VirtualScroll, Trigger } from '../../src';

const scroll = new VirtualScroll('#root', {
  name: 'virtual-scroll',
  offset: 0.15,
});
scroll.add('.box', {
  animate: {
    to: { opacity: 0 },
  },
});
