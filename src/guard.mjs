/**
 * enforces conditions of routes
 * Like presents of values in the context
 */
export class Guard {
  hasGuard(other) {
    return this === other;
  }

  attach(route) {}

  async enter(route, context) {}

  async leave(route, context) {}
}

/**
 * execute guards in a sequence
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
