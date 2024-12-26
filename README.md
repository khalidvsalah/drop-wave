# Drop-wave - Animation Library

Drop-wave is JavaScript animation library that make it easier for developer to make cool animation and interactive interfaces, supporting a wide variety of features **(Tween, Timeline, Virtual-Scroll, Scroll-Trigger, ...etc)**.

### Installation

```
yarn add drop-wave
```

### Documentaion

Coming Soon.

{
"name": "drop-wave",
"version": "1.0.53",
"description": "A JavaScript Animation Library",
"repository": "khalidvsalah/drop-wave.git",
"author": "Khalid Salah <khalidvsalah@gmail.com> (https://www.khalidsalah.com)",
"license": "MIT",
"main": "src/index.js",
"module": "dist/index.esm.js",
"types": "src/types.js", // Point to the JSDoc type definitions
"exports": {
".": {
"import": "dist/index.esm.js",
"require": "dist/index.cjs.js"
},
"./react": {
"import": "drop-wave/react/index.js",
"require": "drop-wave/react/index.cjs.js"
},
"./plugins": {
"import": "drop-wave/plugins/index.js",
"require": "drop-wave/plugins/index.cjs.js"
}
},
"devDependencies": {
"@babel/core": "^7.23.9",
"@babel/preset-env": "^7.24.8",
"@parcel/babel-preset-env": "^2.12.0",
"@testing-library/jest-dom": "^6.5.0",
"babel-eslint": "^10.1.0",
"babel-jest": "^29.7.0",
"colors": "^1.4.0",
"esbuild": "^0.23.0",
"esbuild-minify-templates": "^0.11.0",
"esbuild-plugin-babel": "^0.2.3",
"eslint": "^8.36.0",
"eslint-config-standard": "^17.1.0",
"eslint-plugin-import": "^2.29.1",
"eslint-plugin-n": "^16.6.2",
"jest": "^29.7.0",
"jsdom": "^24.1.1",
"prettier": "^2.4.1",
"vite": "^6.0.3"
},
"scripts": {
"test": "jest",
"build": "node scripts/bundle.mjs",
"push": "bash scripts/push.sh",
"lint": "eslint src/\*_/_.js",
"publish": "bash scripts/publish.sh",
"vite": "vite"
}
}
