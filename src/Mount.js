function setProps(node, props) {
  for (let key in props) {
    if (key.match(/^on/)) {
      node.addEventListener(
        key.match(/[A-Z](.*)/)[0].toLowerCase(),
        props[key]
      );
    } else {
      node.setAttribute(key, props[key]);
    }
  }
}

function create(element) {
  let node;

  if (typeof element === "string" || typeof element === "number") {
    node = document.createTextNode(element);
  } else {
    node = document.createElement(element.type);

    if (element.props) {
      setProps(node, element.props);
    }

    if (element.children) {
      if (
        typeof element.children === "string" ||
        typeof element.children === "number"
      ) {
        node.appendChild(create(element.children));
      } else {
        element.children.map(create).forEach(node.appendChild.bind(node));
      }
    }
  }

  return node;
}

function _C(root, element) {
  return root.appendChild(create(element));
}

export default _C;
