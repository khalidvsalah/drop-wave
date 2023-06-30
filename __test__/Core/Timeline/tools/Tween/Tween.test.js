import { Tween } from "../../../../../src";

describe("Tween function", () => {
  test("Match return Object", () => {
    let ele = document.createElement("div");
    document.body.appendChild(ele);

    let o = { d: 1, ease: "l", p: { y: [100, "%"] } };
    let returnedObj = {
      reverse: expect.any(Function),
      pause: expect.any(Function),
      resume: expect.any(Function),
      play: expect.any(Function),
      item: expect.any(Object),
      tween: expect.any(Object),
    };

    expect(Tween(ele, o)).toEqual(returnedObj);
  });
});
