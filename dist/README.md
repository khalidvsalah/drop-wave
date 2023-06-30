## Blink Wave 🌊

##### A JavaScript Library Contain (virtual-scroll, Tween, Route, Subscribe, Raf, Ease).

```js
import { Tween, Scroll, Raf, Ease, Sub, Route } from "blinkwave";
```

&nbsp;

#### Tween

##### Function for animating dom-element, supported css-properties (opacity, transform, scale).

```js
Tween(domElement, {
    d: 0.4, // duration
    delay: 0.4, // delay
    ease: "io4" // easeInOut4
    p: {y: [100, "%"]} // ((y[0]=> end), (y[1]=> ("%", "px")))
});
```

###

#### Subscribe

##### a Function for adding observer & Subscriber.

```js
window.addEventListener("wheel", Sub.obs("wheel").cb); // create Observer.
this.wheel = Sub.add("wheel", this.Wheel.bind(this)); // subscribe to an event.
Sub.remove("wheel", this.wheel); // unsubscribe to an event.
```

###

#### Virtual-Scroll

##### Add smooth scrolling to the page & you can add element to be revealed when you need.

```js
const scroll = new Scroll(domElement, {drag: true, lerp: 0.1});
scroll.add(domElement, {s: 10, o: {
    d: 0.4,
    delay: 0.4,
    ease: "io4"
    p: {y: [100, "%"]}
}});
```

###

#### Raf

##### RequestAnimationFrame.

```js
const scroll = Raf({
  cb: (e) => {
    const ease = Ease["io4"](e);
    return ease;
  }
});
```
