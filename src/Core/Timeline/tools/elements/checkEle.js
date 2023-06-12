export default function checkElement(element) {
  let result;

  if (typeof element === "string") {
    result = document.querySelector(element);
  } else if (element instanceof window.HTMLElement) {
    result = element;
  } else if (typeof element === "object") {
    result = element;
  }

  return result;
}
