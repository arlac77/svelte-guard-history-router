
const dummyFunction = () => {}; 
const dummySet = { size: 0, forEach: dummyFunction };
const dummyGuard = { toString: () => "", enter: dummyFunction, leave: dummyFunction };
const dummyParent = {
  path: "",
  guard: dummyGuard,
  enter: dummyFunction,
  leave: dummyFunction,
  propertiesFor: () => undefined,
  objectFor: () => undefined
};

function ref(obj, str) {
  for (const part of str.split(".")) {
    obj = obj[part];
  }
  return obj;
}

/**
 * Route
 * @property {string} _path
 * @property {SvelteComponent} component target to show
 * @property {SvelteComponent} linkComponent content for {@link ObjectLink}
 * @property {number} priority
 * @property {string[]} keys as found in the path
 * @property {RegEx} regex
 * @property {any} value
 */
export class SkeletonRoute {
  /**
   * Full path of the Route including all parents
   * @return {string} path
   */
  get path() {
    return this.parent.path + this._path;
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

  matches(object, properties) {
    for (const [p, n] of Object.entries(this.propertyMapping)) {
      if (ref(object, n) !== properties[p]) {
        return false;
      }
    }

    return object instanceof this.objectInstance;
  }

  /**
   * Extract properties from object.
   * @param {Object} object
   * @return {Object|undefined} properties extracted from given objects
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
        properties[p] = v;
      }
    }

    return properties;
  }

  /**
   * Find common ancestor with another Route
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

  get subscriptions() {
    return this._subscriptions || dummySet;
  }

  get parent() {
    return this._parent || dummyParent;
  }

  get guard() {
    return this._guard || dummyGuard;
  }

  /**
   * Map properties to objects attributes.
   * Keys are the property names and values are the keys in the resulting object.
   * @return {Object}
   */
  get propertyMapping() {
    return this._propertyMapping || {};
  }

  get objectInstance() {
    return this._objectInstance || Object;
  }

  subscribe(subscription) {
    if (this.subscriptions === dummySet) {
      this._subscriptions = new Set();
    }
    this.subscriptions.add(subscription);
    subscription(this.value);
    return () => this.subscriptions.delete(subscription);
  }

  /**
   * Deliver object for a given set of properties
   * @param {Object} properties
   * @return {Object} for matching properties
   */
  objectFor(transition, properties) {
    return this.parent.objectFor(transition, properties);
  }

  iteratorFor(transition, properties) {
    return this.parent.iteratorFor(transition, properties);
  }
}

export class IteratorStoreRoute extends SkeletonRoute {
  constructor() {
    super();
    this.value = [];
  }

  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);

    const entries = [];

    this.subscriptions.forEach(subscription => subscription(entries));

    const properties = transition.router.params;

    for await (const e of await this.iteratorFor(transition, properties)) {
      entries.push(e);
    }

    this.value = entries;

    this.subscriptions.forEach(subscription => subscription(entries));
  }
}

export class ObjectStoreRoute extends SkeletonRoute {
  async enter(transition, untilRoute) {
    await super.enter(transition, untilRoute);
    const object = await this.objectFor(transition, transition.router.params);

    this.value = object;
    this.subscriptions.forEach(subscription => subscription(object));
  }
}

export class ChildStoreRoute extends ObjectStoreRoute {
  async objectFor(transition, properties) {
    for await (const object of this.parent.iteratorFor(
      transition,
      properties
    )) {
      if (this.matches(object, properties)) {
        return object;
      }
    }
  }
}
