# Drop-wave - Animation Library

Drop-wave is JavaScript animation library that make it easier for developer to make cool animation and interactive interfaces, supporting a wide variety of features **(Tween, Timeline, Virtual-Scroll, Scroll-Trigger, ...etc)**.

### Installation

```
yarn add drop-wave
```

### Documentaion

```js
import { tween } from 'drop-wave';

// time in seconds
// Define animation options
// Create a tween animation

const animation = tween(elements, {
  duration: 2,
  delay: 1,
  space: 0.1,
  ease: 'io2',
  props: { opacity: 1 }
  onStart: (element) => console.log('Animation started for', element),
  onUpdate: (progress, element) =>
    console.log('Progress:', progress, 'for', element),
  onComplete: (element) => console.log('Animation completed for', element),
});

// Control the animation
animation.play(); // Start the animation
animation.pause(); // Pause the animation
animation.reverse(); // Reverse the animation
animation.kill(); // Stop and destroy the animation
```

```js
import { tween } from 'drop-wave';

// time in seconds
// Define animation options
// Create a tween animation

const timeline = new Timeline({delay: 1,})
const animation = timeline.to(elements, {
  d uration: 2,
    delay: 1,
    space: 0.1,
    ease: 'io2',
    props: { opacity: 1 }
}, "+1")
.to(nextElements,{
    duration: 2,
    delay: 1,
    space: 0.1,
    ease: 'io2',
    props: { opacity: 1 }
}, "-.25");

// Control the animation
timeline.reverse(); // Reverse the animation
```

```js
// Virtual Scroll
import { VirtualScroll } from 'drop-wave';

const scrollContainer = document.querySelector('.scroll-container');
const virtualScroll = new VirtualScroll(scrollContainer, {
  name: 'myScrollInstance', // Optional: Unique identifier for the scroll instance
  container: window, // Optional: The container element for scrolling
  dir: 'y', // Optional: Direction of scrolling ('x' for horizontal, 'y' for vertical)
  drag: true, // Optional: Enable drag-to-scroll
  wheel: true, // Optional: Enable mouse wheel scrolling
  key: true, // Optional: Enable keyboard navigation
  speed: 0.09, // Optional: Scrolling speed
  infinite: false, // Optional: Enable infinite scrolling
  onUpdate: (time, scroll) => {
    console.log('Scroll updated:', scroll);
  }, // Optional: Callback function for scroll updates
});

/* Trigger */

// Trigger with animate function
const animatedElement = document.querySelector('.animate-me');
virtualScroll.add(animatedElement, {
  start: '0%', // Start position for triggering
  end: '100%', // End position for triggering
  animate: { opacity: 1 }, // Animation properties
  pin: { start: '0%', end: '100%' }, // Pinning options
  onUpdate: (progress, element) => {
    console.log('Element progress:', progress);
  }, // Optional: Callback for element updates
});

// Trigger with tween function
const animatedElement = document.querySelector('.animate-me');
virtualScroll.add(animatedElement, {
  start: '0%', // Start position for triggering
  end: '100%', // End position for triggering
  tween: {
    duration: 1,
    ease: 'io5',
    props: { opacity: 1 },
  }, // Tween properties
});
```

```js
// Ease
import { ease } from 'drop-wave';

ease.linear; // easing function
// (linear, i1,o1,io1, i2,o2,io2, i3,o3,io3, i4,o4,io4, i5,o5,io5, i6,o6,io6)
// and a custom easing ease.custom(".9, .1, .1, .9");
```

```js
// Properties
const animation = tween(elements, {
  duration: 2,
  props: {
      opacity: 1,
      transform: {
        x: "100px", // to
        y: "100%", // to
        scale: 1,
        scaleX: [0, 1] // from - to
        scaleY: [0, 1] // from - to
        rotate: 1,
        rotateX: 1,
        rotateY: [45, 90],
      },
      filter: {
          blur: "4px",
          contrast: "10%",
          gray: "50%"
      },
      clipPath: {
          circle: "50 at 50 50",
          polygon: "0 0, 0 100, 100 100, 100 0"
      },
      draw: [0, 1] // from - to,
      path: element.getAttribute("d"),
      points: element.getAttribute("points"),
    },
});
```
