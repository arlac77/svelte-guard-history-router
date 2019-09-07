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
   * @param {Route} from 
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
    enter: async (...args) => {
      for (child of children) {
        await c.enter(...args);
      }
    },
    leave: async (...args) => {
      for (child of children) {
        await c.leave(...args);
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
    enter: async (...args) =>
      Promise.all([...children].map(c => c.enter(...args))),
    leave: async (...args) =>
      Promise.all([...children].map(c => c.leave(...args)))
  };
}
