import { sequenceGuard } from "./guard.mjs";

/**
 * Base route without guard
 * @property {string} localPath
 * @property {SvelteComponent} component target to show
 * @property {number} priority
 * @property {string[]} keys as found in the path
 * @property {RegEx} regex
 */
export class SkeletonRoute {
  static get isRoute() { return true; }

  /**
   * Enter the route from a former one.
   * @param {Transition} transition
   */
  async enter(transition) {
    if(this.parent && this.parent.guard) {
      await this.parent.guard.enter(transition);
    }

    if (this.guard) {
      return this.guard.enter(transition);
    }
  }

  /**
   * Leave the route to a new one.
   * @param {Transition} transition
   */
  async leave(transition) {
    if (this.guard) {
      await this.guard.leave(transition);
    }

    if(this.parent && this.parent.guard) {
      await this.parent.guard.leave(transition);
    }
  }

  /**
   * Extract properties from object(s).
   * @return {object} properties extracted from given objects
   */
  propertiesFor(...objects) {
    return undefined;
  }

  /**
   * Deliver object for a given set of properties
   * @param {object} properties
   * @return {object} for matching properties
   */
  objectFor(properties) {
    return undefined;
  }

  /**
   * Full path of the Route including all parents
   * @return {string} path
   */
  get path()
  {
    return this.parent ? this.parent.path + this.localPath : this.localPath;
  }
}

/**
 * Helper function to create routes with optional guards
 * @param {Route} path
 * @param {string} path
 * @param {Guard|SvelteComponent[]} args last one must be a SvelteComponent
 */
export function route(path, ...args) {
  let route;

  if (args[0].isRoute) {
    const factory = args.shift();
    route = new factory();
  } else {
    route = new SkeletonRoute();
  }

  route.component = args.pop();
  route.localPath = path;

  switch (args.length) {
    case 0:
      break;
    case 1:
      route.guard = args[0];
      break;
    default:
      route.guard = sequenceGuard(args);
  }

  return route;
}
