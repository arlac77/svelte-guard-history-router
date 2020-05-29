/**
 * Enforces conditions of routes
 * Like the presents of values in the context
 */
export class Guard {
  /**
   * Called when guard is attached to a route (one time)
   * @param {Route} route
   */
  attach(route) {}

  /**
   * Called while entering a route (current outlet is not yet set)
   * @param {Transition} transition
   */
  async enter(transition) {}

  /**
   * Called before leaving a route
   * @param {Transition} transition
   */
  async leave(transition) {}
}

/**
 * Execute guards in a sequence
 * @param {Iterable<Guard>} children
 */
export function sequenceGuard(children) {
  return {
    attach: route => children.forEach(c => c.attach(route)),
    enter: async transition => {
      for (const child of children) {
        await child.enter(transition);
      }
    },
    leave: async transition => {
      for (const child of children) {
        await child.leave(transition);
      }
    }
  };
}

/**
 * Execute guards in a parallel
 * @param {Iterable<Guard>} children
 */
export function parallelGuard(children) {
  return {
    attach: route => children.forEach(c => c.attach(route)),
    enter: async transition =>
      Promise.all([...children].map(c => c.enter(transition))),
    leave: async transition =>
      Promise.all([...children].map(c => c.leave(transition)))
  };
}
