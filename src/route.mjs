/**
 * @param {string} path
 * @param {SvelteComponent} component target to show
 * @param {Guard[]} guards
 * @property {string} path
 * @property {SvelteComponent} component target to show
 * @property {Guard[]} guards
 * @property {number} priority
 * @property {string[]} keys
 * @property {RegEx} regex
 */
export class Route {
  constructor(path, component, guards = []) {
    Object.defineProperties(this, {
      path: { value: path },
      component: { value: component },
      guards: { value: guards }
    });

    for (const guard of guards) {
      if (guard.attach !== undefined) {
        guard.attach(this);
      }
    }
  }

  hasGuard(guard)
  {
    return this.guards.find((g) => g === guard) ? true : false;
  }

  /**
   * Enter the route from a former one.
   * Calls guard enter on all guards present in our gurad but absent in the former one
   * @param {Transition} transition 
   */
  async enter(transition) {
    return Promise.all(
      this.guards
        .map(g => g.enter(transition))
    );
  }

  /**
   * Leave the route to a new one.
   * Calls quard leave on all our guards which are not in the new route 
   * @param {Transition} transition 
   */
  async leave(transition) {
    return Promise.all(
      this.guards
        .map(g => g.leave(transition))
    );
  }
}

/**
 * 
 * @param {string} path 
 * @param {Guard[]} args last one must be a SvelteComponent
 */
export function route(path, ...args) {
  const component = args.pop();
  return new Route(path, component, args);
}
