/**
 * Enforces conditions of routes
 * Like presents of values in the context
 */
export class Guard {
  hasGuard(other) {
    return this === other;
  }

  /**
   * Called when guard is attached to a route
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
 * execute guards in a sequence
 * @param {Iterable<Guard>} children
 */
export async function sequenceGuard(children) {
  return {
    hasGuard(guard) {
      return children.find(g => g === g.hasGuard(guard)) ? true : false;
    },

    attach: route => children.forEach(c => c.attach(route)),
    enter: async (transition) => {
      for (child of children) {
        await c.enter(transition);
      }
    },
    leave: async (transition) => {
      for (child of children) {
        await c.leave(transition);
      }
    }
  };
}

/**
 * execute guards in a parallel
 * @param {Iterable<Guard>} children
 */
export async function parallelGuard(children) {
  return {
    hasGuard(guard) {
      return children.find(g => g === g.hasGuard(guard)) ? true : false;
    },
    attach: route => children.forEach(c => c.attach(route)),
    enter: async (transition) =>
      Promise.all([...children].map(c => c.enter(transition))),
    leave: async (transition) =>
      Promise.all([...children].map(c => c.leave(transition)))
  };
}
