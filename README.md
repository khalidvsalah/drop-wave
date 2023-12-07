## Blink Wave 🌊

##### A JavaScript Library Contain (tween, subscribe, raf, ease).

##### Coming soon features (timeline).

```js
import { tween, raf, ease, sub } from "blinkwave";
```

&nbsp;

#### Tween

##### Function for animating dom-element, supported css-properties (opacity, transform, scale).

```js
tween(domElement, {
    d: 0.4, // duration
    late: 0.4, // late
    ease: "io4" // easeInOut4
    p: {a: [100]} // ((a[0]=> end))
    raf: (e)=> (console.log(e)) // get called for every frame the tween is playing.
    start: ()=> (console.log("go")) // onStart.
    completed: ()=> (console.log("done")) // onCompleted.
});
```

###

#### Current Properties

#####

```js
// transform
tween(element: {
    p:{ fore: {
            y: [100, "%"], // ((y[0]=> end), (y[1]=> unit)) (translateY)
            x: [100, "%"], // (translateX)
            sx: [100, "%"], // (scaleX)
            sy: [100, "%"], // (scaleY)
            rx: [100, "%"], // (rotateX)
            ry: [100, "%"] // (rotateY)
        }
    }
});
///////

// opacity
tween(element: {
    p:{a: [1]} // alpha => opacity
});
///////

// blur
tween(element: {
    p:{blur: [12]} // filter: blur(12);
});
///////

// top
tween(element: {
    p:{t: [12, "px"]} // top;
});

///////

// Current Units
// (px, unit)
```

###

#### Subscribe

##### a Function for adding observer & Subscriber.

```js
window.addEventListener("wheel", sub.obs("wheel").cb); // create Observer.
this.wheel = sub.add("wheel", this.Wheel.bind(this)); // subscribe to an event.
this.wheel.r(); // unsubscribe to an event.
```

###

#### Raf

```js
raf({
  cb: (e) => {
    const ease = Ease["io4"](e);
    return ease;
  },
  d: 0.6,
});
```

###

#### scroll

```js
/**
 * @param {HTMLElement|Window} attacher - the parent
 * @param {Object} o - properties
 */
const scoll = new scroll(window, { target: iSet.id("app") });

// You can animate a element in a specific point
scoll.add(iSet.el(".box"), {
  tween: {
    d: 0.8,
    ease: "io2",
    p: { form: { x: [400, "%"] } },
  },
  start: 50,
});

// You can animate a element while scrolling
scoll.add(iSet.el(".fade"), {
  scroll: true,
  p: { a: [0] },
});
```
