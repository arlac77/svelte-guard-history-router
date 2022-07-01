import { sequenceGuard } from "./guard.mjs";

const dummyFunction = () => {};
const dummySet = { size: 0, forEach: dummyFunction };

/**
 * Default empty guard does nothing.
 */
const nullGuard = {
  toString: () => "",
  enter: dummyFunction,
  leave: dummyFunction
};

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

/**
 * Route at the root of the tree.
 * This route has no parent.
 * All other routes are below of this one.
 */
class RootRoute {
  /**
   * Are there parameters in the path.
   * @return {boolean} true if route has parameters (:key)
   */
  get hasParams() {
    return this.keys.length > 0;
  }

  /**
   * @return {string} empty as we are the root
   */
  get path() {
    return "";
  }

  get objectInstance() {
    return Object;
  }

  /**
   * @return {object} empty object
   */
  get propertyMapping() {
    return {};
  }

  /**
   * @return {Guard} empty guard which does nothing
   */
  get guard() {
    return nullGuard;
  }

  enter() {}
  leave() {}
  propertiesFor() {}
  valueFor() {}
  async *iteratorFor() {}

  pathFor(value, suffix = "") {
    const properties = this.propertiesFor(value);
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
          this.emit();
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

  emit()
  {
    this.subscriptions.forEach(subscription => subscription(this));
  }

  /**
   * Enter the route from a former one.
   * All parent routes up to the common ancestor are also entered.
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
   * All parent routes up to the common ancestor are also left.
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
   * Check properties against value.
   * @param {any} value
   * @param {Object} properties
   * @return {boolean} true if value properties are matching with the given properties
   */
  matches(value, properties) {
    if (value instanceof this.objectInstance) {
      for (const [p, n] of Object.entries(this.propertyMapping)) {
        if (ref(value, n) !== properties[p]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Extract properties from a value.
   * All property values are strings.
   * @param {any} value source of the values
   * @return {Object|undefined} properties extracted from given value
   */
  propertiesFor(value) {
    let properties = this.parent.propertiesFor(value);

    if (value instanceof this.objectInstance) {
      for (const [p, n] of Object.entries(this.propertyMapping)) {
        const v = ref(value, n);
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
   * Find common ancestor with an other Route.
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
   * Deliver value for a given set of properties of the transition.
   * Default implemantation asks the parent route.
   * @param {Transition} transition
   * @return {any} for matching properties
   */
  valueFor(transition) {
    return this.parent.valueFor(transition);
  }

  async *iteratorFor(transition) {
    yield* this.parent.iteratorFor(transition);
  }

  /**
   * Deliver property mapping.
   * Default implemantation asks the parent route.
   * @return {Object} for matching properties
   */
  get propertyMapping() {
    return this.parent.propertyMapping;
  }

  /**
   * Default implemantation asks the parent route.
   */
  get objectInstance() {
    return this.parent.objectInstance;
  }
}

export class ValueStoreRoute extends SkeletonRoute {
  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);
    this.value = await this.valueFor(transition);
  }
}
