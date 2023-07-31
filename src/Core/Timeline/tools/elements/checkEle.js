import { iSet } from "../../../../index";

export default function checkElement(element) {
  this.obj = false;
  if (typeof element === "string") {
    this.target = iSet.el(element);
  } else if (element instanceof Node) {
    this.target = element;
  } else {
    this.obj = true;
    this.target = element;
  }
}
