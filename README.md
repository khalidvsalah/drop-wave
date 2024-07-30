# Stabraq

A JavaScript Animation Library.

### ( tween, query, register )

```javascript
import { tween, query, register } from 'stabraq';

register(blur /* registered name */, {
  cssName: 'filter',
  callback: obj => {
    const start = obj[0];
    const lerp = obj[1] - start;
    return time => `blur(${start + lerp * time}px)`;
  }
}); // alot of possibilities using register

tween(query.id('ele'), {
  dur: 1, // duration
  late: 1, // delay
  props: {
    transform: {
      x: [0, 100, '%'] // default: px
    },
    opacity: [0, 1],
    clipPath: {
      circle: ['50 at 50 50', '0 at 50 50']
    },
    blur: [0, 4]
  } // tweened css properties
});
```

### ( scroll, trigger )

```javascript
import { scroll, trigger, query } from 'stabraq';

const virtual = new scroll(query.id('root'), {
  name: 'fvs', // optional each scroll has uniqe name
  container: window, // where events will be attached
  wheel: true, // default: true
  key: true, // default: true
  drag: true, // default: true
  speed: true, // scroll speed
  infinite: false, // default: false
  onUpdate: (time, scroll) => console.log(time, scroll)
});

// animate while scrolling
virtual.add(query.el('.box'), {
  scroll: true,
  animate: { opacity: [0, 1] },
  start: '-100', // start before 100 pixel
  end: '0' // end on element bottom positon
});

// pin element on the screen
virtual.add(query.el('.image'), {
  pin: {
    start: '0',
    end: '+100'
  }
});

// fire on reaching specific poition
virtual.add(query.el('.image'), {
  tween: {
    dur: 1,
    late: 1,
    props: {
      blur: [0, 4]
    }
  },
  start: '-100'
});
```

### ( splitText )

```javascript
import { splitText, query } from 'stabraq';

const { lines, words, letters } = splitText(query.el('p'), {
  lines: true,
  words: true,
  letters: true
});
```
