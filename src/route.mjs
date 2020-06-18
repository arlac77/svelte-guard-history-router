import { sequenceGuard } from "./guard.mjs";

/**
 * Base route without guard
 * @param {string} path
 * @param {SvelteComponent} component target to show
 * @property {string} path
 * @property {SvelteComponent} component target to show
 * @property {number} priority
 * @property {string[]} keys as found in the path
 * @property {RegEx} regex
 */
export class Route {
  constructor(path, component) {
    Object.defineProperties(this, {
      path: { value: path },
      component: { value: component }
    });
  }

  /**
   * Enter the route from a former one.
   * @param {Transition} transition
   */
  async enter(transition) {}

  /**
   * Leave the route to a new one.
   * @param {Transition} transition
   */
  async leave(transition) {}

  /**
   * Extract properties from object(s).
   * @return {object} properties extracted from given objects
   */
  propertiesFor(...objects) {
    return undefined;
  }

  /**
   * Deliver path with properties expanded to point to object(s).
   * @param {objects} objects to be pointed to
   * @return {string} path with properties replaces for objects. undefined if object does not fit
   */
  pathFor(...objects) {
    const properties = this.propertiesFor(...objects);
    return properties
      ? this.path.replace(/:(\w+)/g, (m, name) => properties[name])
      : undefined;
  }

  /**
   * Deliver object for a given set of properties
   * @param {object} properties
   * @return {object} for matching properties
   */
  objectFor(properties) {
    return undefined;
  }
}

/**
 * Route with a guard
 * @param {string} path
 * @param {SvelteComponent} component target to show
 * @param {Guard} guard
 * @property {string} path
 * @property {SvelteComponent} component target to show
 * @property {Guard} guard
 * @property {number} priority
 * @property {string[]} keys as found in the path
 * @property {RegEx} regex
 */
export class GuardedRoute extends Route {
  constructor(path, component, guard) {
    super(path, component);
    Object.defineProperties(this, {
      guard: { value: guard }
    });
  }

  /**
   * Enter the route from a former one.
   * Calls guard enter on all guards present in our gurad but absent in the former one
   * @param {Transition} transition
   */
  async enter(transition) {
    if (this.guard) {
      return this.guard.enter(transition);
    }
  }

  /**
   * Leave the route to a new one.
   * Calls guard leave on all our guards which are not in the new route
   * @param {Transition} transition
   */
  async leave(transition) {
    if (this.guard) {
      return this.guard.leave(transition);
    }
  }
}

/**
 * Helper function to create routes with optional guards
 * @param {string} path
 * @param {Guard|SvelteComponent[]} args last one must be a SvelteComponent
 */
export function route(path, ...args) {
  const component = args.pop();

  switch (args.length) {
    case 0:
      return new Route(path, component);
    case 1:
      return new GuardedRoute(path, component, args[0]);
    default:
      return new GuardedRoute(path, component, sequenceGuard(args));
  }
}
