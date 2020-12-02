import { sequenceGuard } from "./guard.mjs";

const dummyFunction = () => {};
const dummySet = { size: 0, forEach: dummyFunction };

function ref(obj, str) {
  for (const part of str.split(".")) {
    obj = obj[part];
    if (obj === undefined) {
      return;
    }
  }
  if (obj !== undefined) {
    return obj.toString();
  }
}

class RootRoute {
  /**
   * Are there parameters in the path.
   * @return {boolean} true if route has parameters (:key)
   */
  get hasParams() {
    return this.keys.length > 0;
  }

  get path() {
    return "";
  }

  get objectInstance() {
    return Object;
  }

  get propertyMapping() {
    return {};
  }

  get guard() {
    return {
      toString: () => "",
      enter: dummyFunction,
      leave: dummyFunction
    };
  }

  enter() {}
  leave() {}
  propertiesFor() {}
  objectFor() {}
  async *iteratorFor() {}

  pathFor(object, suffix = "") {
    const properties = this.propertiesFor(object);
    return this.path.replace(/:(\w+)/g, (m, name) => properties[name]) + suffix;
  }
}

const rootRoute = new RootRoute();

/**
 * Route
 * Subscriptions on Routes fire when the route value changes.
 * @property {string} path full path of the Route including all parents
 * @property {SvelteComponent} component target to show
 * @property {SvelteComponent} linkComponent content for {@link ObjectLink}
 * @property {Object} propertyMapping Map properties to object attributes
 *           Keys are the property names and values are the keys in the resulting object.
 * @property {number} priority
 * @property {string[]} keys as found in the path
 * @property {RegEx} regex
 * @property {any} value
 */
export class SkeletonRoute extends RootRoute {
  constructor(path, options = {}) {
    super();

    for (const n of ["path", "href", "factory", "$$slots", "$$scope"]) {
      delete options[n];
    }

    if (Array.isArray(options.guard)) {
      switch (options.guard.length) {
        case 0:
          delete options.guard;
          break;
        case 1:
          options.guard = options.guard[0];
          break;
        default:
          options.guard = sequenceGuard(options.guard);
      }
    }

    let value;

    Object.defineProperties(this, {
      parent: { value: rootRoute },
      path: { get: () => this.parent.path + path },
      value: {
        set: v => {
          value = v;
          this.subscriptions.forEach(subscription => subscription(this));
        },
        get: () => value
      },
      ...Object.fromEntries(
        Object.entries(options)
          .filter(([k, v]) => v !== undefined)
          .map(([k, v]) => [k, { value: v }])
      )
    });

    this.subscriptions = dummySet;
  }

  /**
   * Enter the route from a former one.
   * @param {Transition} transition
   * @param {Route} untilRoute the common ancestor with the former route
   */
  async enter(transition, untilRoute) {
    if (this !== untilRoute) {
      await this.parent.enter(transition, untilRoute);
      return this.guard.enter(transition);
    }
  }

  /**
   * Leave the route to a new one.
   * @param {Transition} transition
   * @param {Route} untilRoute the common ancestor with the next route
   */
  async leave(transition, untilRoute) {
    if (this !== untilRoute) {
      await this.guard.leave(transition);
      return this.parent.leave(transition, untilRoute);
    }
  }

  /**
   * Check properties against object.
   * @param {Object} object
   * @param {Object} properties
   * @return {boolean} true if object properties are matching with the given proerties
   */
  matches(object, properties) {
    if (object instanceof this.objectInstance) {
      for (const [p, n] of Object.entries(this.propertyMapping)) {
        if (ref(object, n) !== properties[p]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Extract properties from object.
   * All property values are strings.
   * @param {Object} object source of the values
   * @return {Object|undefined} properties extracted from given object
   */
  propertiesFor(object) {
    let properties = this.parent.propertiesFor(object);

    if (object instanceof this.objectInstance) {
      for (const [p, n] of Object.entries(this.propertyMapping)) {
        const v = ref(object, n);
        if (v === undefined) {
          return undefined;
        }
        if (properties === undefined) {
          properties = {};
        }
        properties[p] = v.toString();
      }
    }

    return properties;
  }

  /**
   * Find common ancestor with another Route.
   * @param {Route} other
   * @return {Route|undefined} common ancestor Route between receiver and other
   */
  commonAncestor(other) {
    for (let o = other; o; o = o.parent) {
      for (let p = this; p; p = p.parent) {
        if (p === o) {
          return p;
        }
      }
    }
  }

  subscribe(subscription) {
    if (this.subscriptions === dummySet) {
      this.subscriptions = new Set();
    }
    this.subscriptions.add(subscription);
    subscription(this);
    return () => this.subscriptions.delete(subscription);
  }

  /**
   * Deliver object for a given set of properties
   * @param {Transition} transition
   * @return {Object} for matching properties
   */
  objectFor(transition) {
    return this.parent.objectFor(transition);
  }

  async *iteratorFor(transition) {
    yield* this.parent.iteratorFor(transition);
  }

  get propertyMapping() {
    return this.parent.propertyMapping;
  }

  get objectInstance() {
    return this.parent.objectInstance;
  }
}

export class ObjectStoreRoute extends SkeletonRoute {
  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);
    this.value = await this.objectFor(transition);
  }
}
