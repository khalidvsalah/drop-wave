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

const elements = '.animate-me';
const animation = tween(elements, {
  duration: 2,
  delay: 1,
  space: 0.1,
  ease: 'io2',
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
