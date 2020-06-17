import { StoreRoute } from "./store-route.mjs";

export class IteratorStoreRoute extends StoreRoute {
  constructor(path, component, options = {}) {
    super(path, component);

    let value = [];

    const properties = {
      value: { get: () => value, set: v => (value = v) }
    };

    if (options.iteratorForProperties) {
      properties.iteratorForProperties = {
        value: options.iteratorForProperties
      };
    }
    if (options.propertiesForObject) {
      properties.propertiesForObject = { value: options.propertiesForObject };
    }

    Object.defineProperties(this, properties);
  }

  async enter(transition) {
    this.subscriptions.forEach(subscription => subscription([]));

    const properties = transition.router.params;
    const entries = [];

    for await (const e of await this.iteratorForProperties(properties)) {
      entries.push(e);
    }

    this.value = entries;

    this.subscriptions.forEach(subscription => subscription(entries));
  }

  propertiesForObject(object) {
    return Object.fromEntries(this.keys.map(key => [key, object[key]]));
  }

  pathFor(...objects) {
    const properties = this.propertiesForObject(...objects);
    return this.path.replace(/:(\w+)/g, (m, name) => properties[name]);
  }
}

export default IteratorStoreRoute;
