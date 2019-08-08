export class Route {
  constructor(path, component, guards = []) {
    Object.defineProperties(this, {
      path: { value: path },
      component: { value: component },
      guards: { value: guards }
    });

    for (const guard of guards) {
      if (guard.attach !== undefined) {
        guard.attach(route);
      }
    }
  }

  /**
   * enter the route from a former one
   * @param {RouterContext} context
   * @param {Route} form
   */
  async enter(context, from) {
    return Promise.all(
      this.guards
        .filter(p => p.enter !== undefined)
        .map(p => p.enter(context))
    );
  }

  /**
   * leave the route to a new one
   * @param {RouterContext} context
   * @param {Route} to
   */
  async leave(context, to) {
    return Promise.all(
      this.guards
        .filter(p => p.leave !== undefined)
        .map(p => p.leave(context))
    );
  }
}

export function route(path, ...args) {
  const component = args.pop();
  return new Route(path, component, args);
}
