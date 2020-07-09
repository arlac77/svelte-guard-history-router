import { sequenceGuard } from "./guard.mjs";

/**
 * Base route without guard
 * @property {string} localPath
 * @property {SvelteComponent} component target to show
 * @property {number} priority
 * @property {string[]} keys as found in the path
 * @property {RegEx} regex
 * @property {any} value
 * @property {any} defaultValue
 */
export class SkeletonRoute {
  static get isRoute() {
    return true;
  }

  /**
   * Enter the route from a former one.
   * @param {Transition} transition
   */
  async enter(transition) {
    if (this.parent && this.parent.guard) {
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

    if (this.parent && this.parent.guard) {
      await this.parent.guard.leave(transition);
    }
  }

  /**
   * Extract properties from object.
   * @param {Object} object
   * @return {Object|undefined} properties extracted from given objects
   */
  propertiesFor(object) {
    const pp = this.parent ? this.parent.propertiesFor(object) : undefined;

    if (this.keys.size === 0) {
      return pp;
    }

    const entries = this.keys
      .map(key => [key, object[key]])
      .filter(([k, v]) => v !== undefined);

    return pp !== undefined || entries.length > 0
      ? Object.assign(Object.fromEntries(entries), pp)
      : undefined;
  }

  /**
   * Deliver object for a given set of properties
   * @param {Object} properties
   * @return {Object} for matching properties
   */
  objectFor(properties) {
    return this.parent ? this.parent.objectFor(properties) : undefined;
  }

  /**
   * Default value used for store.
   * @return {any}
   */
  get defaultValue() {
    return undefined;
  }

  /**
   * Value used for store.
   * @return {any}
   */
  get value() {
    return this.defaultValue;
  }

  /**
   * Full path of the Route including all parents
   * @return {string} path
   */
  get path() {
    return this.parent ? this.parent.path + this.localPath : this.localPath;
  }
}

/**
 * Helper function to create routes with optional guards
 * @param {Route?} parent
 * @param {string?} path
 * @param {Route?} factory
 * @param {Guard|SvelteComponent[]} args last one must be a SvelteComponent
 */
export function route(...args) {
  let route, path, parent;

  if (typeof args[0] !== "string") {
    parent = args.shift();
  }

  path = args.shift();

  if (args[0].isRoute) {
    const factory = args.shift();
    route = new factory();
  } else {
    route = new SkeletonRoute();
  }

  route.component = args.pop();
  route.localPath = path;
  if (parent) {
    route.parent = parent;
  }

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
