import { Tween } from "../../../../../src";

describe("Tween.to function", () => {
  test("to return undefined", () => {
    let ele = document.createElement("div");
    let o = { d: 1, ease: "l", p: { y: [0, 100, "%"] } };

    expect(Tween.to(ele, o)).toBe(undefined);
  });

  test("expect this.stop to equal false", () => {
    expect(Tween.stop).toBe(false);
  });
});
