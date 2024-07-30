import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
    </head>
    <body>
      <main>
        <h3>Hello World!</h3>
        <p style="height: 100px;">Lorem Case 001</p>
      </main>
    </body>
  </html>
`;
const { window } = new JSDOM(html);
global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Node = window.Node;
global.NodeList = window.NodeList;

var lastTime = 0;
window.requestAnimationFrame = function (callback) {
  var currTime = new Date().getTime();
  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
  var id = setTimeout(function () {
    callback(currTime + timeToCall);
  }, timeToCall);
  lastTime = currTime + timeToCall;
  return id;
};
window.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};

export default window;
