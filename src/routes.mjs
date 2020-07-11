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

  matches(object, properties) {
    for (const [p, n] of Object.entries(this.propertyMapping)) {
      if (object[n] !== properties[p]) {
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
   * Full path of the Route including all parents
   * @return {string} path
   */
  get path() {
    return this.parent.path + this._path;
  }
}

export class IteratorStoreRoute extends SkeletonRoute {
  constructor() {
    super();
    this.value = [];
  }

  async enter(transition) {
    await super.enter(transition);

    const entries = [];

    this.subscriptions.forEach(subscription => subscription(entries));

    const properties = transition.router.params;

    for await (const e of await this.iteratorFor(properties)) {
      entries.push(e);
    }

    this.value = entries;

    this.subscriptions.forEach(subscription => subscription(entries));
  }
}

export class ObjectStoreRoute extends SkeletonRoute {
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
    for await (const object of this.parent.iteratorFor(properties)) {
      if (this.matches(object, properties)) {
        return object;
      }
    }
  }
}
