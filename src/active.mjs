/**
 * links the note to the active state.
 * @see {Router.updateActive}
 * @param {*} node
 * @param {Router} router
 */
export function active(node, router) {
  router.linkNodes.add(node);
  router.updateActive(node);

  return {
    destroy() {
      router.linkNodes.delete(node);
    }
  };
}
