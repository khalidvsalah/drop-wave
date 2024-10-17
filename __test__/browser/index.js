import './style.css';
import { VirtualScroll } from '../../src';

const root = document.querySelector('#root');
const box = document.querySelector('.box');

const scroll = new VirtualScroll(root);
scroll.add(box, {
  pin: {
    start: '+0%',
    end: '+200%',
  },
});
