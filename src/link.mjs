export function link(node, router) {
  node.addEventListener("click", event => {
    event.preventDefault();
    let href;
    let target = event.target;
    while ((href = target.getAttribute("href")) === null) {
      target = target.parentElement;
      if (target === null) {
        throw Error("Could not find corresponding href value");
      }
    }
    router.push(href);
    return false;
  });
}
