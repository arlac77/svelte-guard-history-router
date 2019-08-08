/**
 * enforces conditions of routes
 * Like presents of values in the context
 */
export class Guard {
  attach(route) {}

  async enter(route, context) {}

  async leave(route, context) {}
}

/**
 * execute guards in a sequence
 */
export async function sequenceGuard(children) {
  return {
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
    attach: route => children.forEach(c => c.attach(route)),
    enter: async (...args) => Promise.all([...children].map(c => c.enter(...args))),
    leave: async (...args) => Promise.all([...children].map(c => c.leave(...args)))
  };
}
