export default function checkElement(element) {
  let result;

  if (typeof element === "string") {
    return document.querySelector(element);
  } else if (element instanceof window.HTMLElement) {
    return element;
  } else if (typeof element === "object") {
    return element;
  }

  return result;
}
