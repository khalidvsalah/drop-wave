import Raf from "../../../src/Animation/Raf/raf";

Raf.push({ d: 1000, cb: () => {} });

describe("check Raf.on", () => {
  test("Before play", () => {
    expect(Raf.on).toBe(false);
  });

  test("After play", () => {
    Raf.play();
    expect(Raf.on).toBe(true);
  });

  test("After amount of time", () => {
    setTimeout(() => expect(Raf.on).toBe(false), 320);
  });
});

describe("check callback funs Raf (cb & compelete)", () => {
  test("cb fun", () => {
    const cb = jest.fn();
    Raf.push({ d: 300, cb });
    setTimeout(() => expect(cb1.mock.calls.length).toBe(1), 1);
  });

  test("completed cb fun", () => {
    const compeleted = jest.fn();
    Raf.push({ d: 300, cb: () => {}, compeleted });
    setTimeout(() => expect(compeleted.mock.calls.length).toBe(1), 301);
  });

  test("completed cb fun & (d = 0)", () => {
    const compeleted = jest.fn();
    Raf.push({ d: 0, cb: () => {}, compeleted });
    setTimeout(() => expect(compeleted.mock.calls.length).toBe(1), 1);
  });
});

describe("paused", () => {
  var o = { d: 500, cb: () => {} };
  Raf.push(o);

  test("paused = true", () => {
    o.pause = true;
    setTimeout(() => {
      expect(o.paused).toBe(true);
    }, 250);
  });

  test("paused = false", () => {
    o.pause = false;
    setTimeout(() => {
      expect(o.pause).toBe(false);
    }, 250);
  });
});

test("items length", () => {
  expect(Raf.items.length).toBe(5);
});
