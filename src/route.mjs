/**
 * @property {string} path
 * @property {SvelteComponent} component target to show
 * @property {Guard[]} guards
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
   * @param {RouterState} state
   * @param {Route} form
   */
  async enter(state, from) {
    return Promise.all(
      this.guards
        .filter(g => g.enter !== undefined && (from === undefined || !from.hasGuard(g)))
        .map(g => g.enter(state))
    );
  }

  /**
   * Leave the route to a new one.
   * Calls quard leave on all our guards which are not in the new route 
   * @param {RouterState} state
   * @param {Route} to
   */
  async leave(state, to) {
    return Promise.all(
      this.guards
        .filter(g => g.leave !== undefined &&(to === undefined || !to.hasGuard(g)))
        .map(g => g.leave(state))
    );
  }
}

/**
 * 
 * @param {string} path 
 * @param {Guard[]} args
 * @param {SvelteComponent} component 
 */
export function route(path, ...args) {
  const component = args.pop();
  return new Route(path, component, args);
}
