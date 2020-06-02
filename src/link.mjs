import { findClosestAttribute } from "./util.mjs";

export function link(node, router) {
  node.addEventListener("click", event => {
    event.preventDefault();

    const href = findClosestAttribute(event.target, "href");

    if (href === null) {
      throw Error("Could not find corresponding href value");
    }

    router.push(href);
    return false;
  });
}
