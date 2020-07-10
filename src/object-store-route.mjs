import { StoreRoute } from "./store-route.mjs";

export class ObjectStoreRoute extends StoreRoute {

  /**
   * Map properties to objects
   * Keys are the property names and values are the keys in the resulting object
   * @return {Object}
   */
  get propertyMapping() {
    return { };
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
