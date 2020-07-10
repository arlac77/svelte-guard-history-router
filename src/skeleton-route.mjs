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
   * Map properties to objects
   * Keys are the property names and values are the keys in the resulting object
   * @return {Object}
   */
  get propertyMapping() {
    return {};
  }

  get factory() {
    return undefined;
  }

  matches(object, properties) {
    if (this.factory !== undefined && ! object instanceof this.factory) {
      return false;
    }

    for (const [p, n] of Object.entries(this.propertyMapping)) {
      if (object[n] !== properties[p]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Extract properties from object.
   * @param {Object} object
   * @return {Object|undefined} properties extracted from given objects
   */
  propertiesFor(object) {
    let properties = this.parent
      ? this.parent.propertiesFor(object)
      : undefined;

    if (this.factory === undefined || object instanceof this.factory) {
      for (const [p, n] of Object.entries(this.propertyMapping)) {
        const v = object[n];
        if (v !== undefined) {
          if (properties === undefined) {
            properties = {};
          }
          properties[p] = v;
        }
      }
    }

    return properties;
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
