import { StoreRoute } from "./store-route.mjs";

export class IteratorStoreRoute extends StoreRoute {
  constructor(options = {}) {
    super();

    let value = [];

    const properties = {
      value: { get: () => value, set: v => (value = v) }
    };

    if (options.iteratorFor) {
      properties.iteratorFor = {
        value: options.iteratorFor
      };
    }
    if (options.propertiesFor) {
      properties.propertiesFor = { value: options.propertiesFor };
    }

    Object.defineProperties(this, properties);
  }

  async enter(transition) {
    await super.enter(transition);
    this.subscriptions.forEach(subscription => subscription([]));

    const properties = transition.router.params;
    const entries = [];

    for await (const e of await this.iteratorFor(properties)) {
      entries.push(e);
    }

    this.value = entries;

    this.subscriptions.forEach(subscription => subscription(entries));
  }
}

export default IteratorStoreRoute;
