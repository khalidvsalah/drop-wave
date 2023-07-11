export default function checkElement(element) {
  let result;

  this.obj = false;
  if (typeof element === "string") {
    result = document.querySelector(element);
  } else if (element instanceof Node) {
    result = element;
  } else {
    this.obj = true;
    result = element;
  }

  return result;
}
