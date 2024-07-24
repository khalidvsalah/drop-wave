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

export default window;
