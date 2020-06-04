import { StoreRoute } from "./store-route.mjs";

export class ObjectStoreRoute extends StoreRoute {
  constructor(path, component, options = {}) {
    super(path, component);

    let value;

    const properties = {
      value: { get: () => value, set: v => (value = v) }
    };

    if (options.objectForProperties) {
      properties.objectForProperties = { value: options.objectForProperties };
    }
    if (options.propertiesForObject) {
      properties.propertiesForObject = { value: options.propertiesForObject };
    }

    Object.defineProperties(this, properties);
  }

  async enter(transition) {
    const properties = transition.router.state.params;
    const object = await this.objectForProperties(properties);
    console.log("OBJECT", object, properties);

    this.value = object;
    this.subscriptions.forEach(subscription => subscription(object));
  }

  propertiesForObject(object) {
    return Object.fromEntries(this.keys.map(key => [key, object[key]]));
  }

  pathFor(...objects) {
    const properties = this.propertiesForObject(...objects);
    return this.path.replace(/:(\w+)/g, (m, name) => properties[name]);
  }
}

export default ObjectStoreRoute;
