const dummySet = { forEach: () => {} };

const dummyGuard = { toString: () => "", enter: () => {}, leave: () => {} };

const dummyParent = {
  path: "",
  guard: dummyGuard,
  propertiesFor: () => undefined,
  objectFor: () => undefined
};

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
    await this.parent.guard.enter(transition);
    return this.guard.enter(transition);
  }

  /**
   * Leave the route to a new one.
   * @param {Transition} transition
   */
  async leave(transition) {
    await this.guard.leave(transition);
    return this.parent.guard.leave(transition);
  }

  /**
   * Map properties to objects attributes.
   * Keys are the property names and values are the keys in the resulting object.
   * @return {Object}
   */
  get propertyMapping() {
    return {};
  }

  get factory() {
    return undefined;
  }

  matches(object, properties) {
    if (this.factory !== undefined && !object instanceof this.factory) {
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
    let properties = this.parent.propertiesFor(object);

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
    return this.parent.objectFor(properties);
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

  get subscriptions() {
    return this._subscriptions || dummySet;
  }

  get parent() {
    return this._parent || dummyParent;
  }

  get guard() {
    return this._guard || dummyGuard;
  }

  subscribe(subscription) {
    if (this.subscriptions === dummySet) {
      Object.defineProperty(this, "_subscriptions", { value: new Set() });
    }
    this.subscriptions.add(subscription);
    subscription(this.value);
    return () => this.subscriptions.delete(subscription);
  }

  /**
   * Full path of the Route including all parents
   * @return {string} path
   */
  get path() {
    return this.parent.path + this._path;
  }
}

export class StoreRoute extends SkeletonRoute {
  constructor() {
    super();
    let value = this.defaultValue;

    const properties = {
      value: { get: () => value, set: v => (value = v) }
    };

    Object.defineProperties(this, properties);
  }
}

export class IteratorStoreRoute extends StoreRoute {
  get defaultValue() {
    return [];
  }

  async enter(transition) {
    await super.enter(transition);

    this.subscriptions.forEach(subscription => subscription([]));

    const properties = transition.router.params;
    const entries = this.defaultValue;

    for await (const e of await this.iteratorFor(properties)) {
      entries.push(e);
    }

    this.value = entries;

    this.subscriptions.forEach(subscription => subscription(entries));
  }
}

export class ObjectStoreRoute extends StoreRoute {
  async enter(transition) {
    await super.enter(transition);

    const properties = transition.router.params;
    const object = await this.objectFor(properties);

    this.value = object;
    this.subscriptions.forEach(subscription => subscription(object));
  }
}

export class ChildStoreRoute extends ObjectStoreRoute {
  async objectFor(properties) {
    for await (const object of this.parent.iteratorFor()) {
      if (this.matches(object, properties)) {
        return object;
      }
    }
  }
}
