import Raf from "../../../src/Animation/Raf/raf";

describe("check Raf.on", () => {
  test("Before play", () => {
    expect(Raf.on).toBe(false);
  });

  test("After play", () => {
    Raf.push({ cb: () => {} });
    expect(Raf.on).toBe(true);
  });
});

describe("check passed obj", () => {
  let o = { cb: () => {} };

  test("Before Push", () => {
    expect(o.id).toBeUndefined();
  });

  test("After Push", () => {
    Raf.push(o);
    expect(o.id).toEqual(expect.any(Number));
  });
});
