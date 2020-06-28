import { StoreRoute } from "./store-route.mjs";

export class ObjectStoreRoute extends StoreRoute {
  constructor() {
    super();

    let value;

    const properties = {
      value: { get: () => value, set: v => (value = v) }
    };

    Object.defineProperties(this, properties);
  }

  async enter(transition) {
    await super.enter(transition);

    const properties = transition.router.params;
    const object = await this.objectFor(properties);

    this.value = object;
    this.subscriptions.forEach(subscription => subscription(object));
  }
}

export default ObjectStoreRoute;
